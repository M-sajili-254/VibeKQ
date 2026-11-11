from io import BytesIO
from tempfile import TemporaryDirectory
from unittest.mock import patch

from PIL import Image
from django.contrib.admin.sites import AdminSite
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from accounts.models import User
from trip_assistant.models import Destination, Service
from trip_assistant.serializers import ServiceSerializer
from .admin import PartnerApplicationAdmin
from .models import MerchantPhoto, PartnerApplication, Partnership


def image_upload(name='storefront.jpg', image_format='JPEG'):
    content = BytesIO()
    Image.new('RGB', (20, 20), color='green').save(content, format=image_format)
    return SimpleUploadedFile(name, content.getvalue(), content_type='image/jpeg')


class MerchantPhotoOnboardingTests(TestCase):
    def setUp(self):
        self.media = TemporaryDirectory()
        self.addCleanup(self.media.cleanup)
        settings = override_settings(MEDIA_ROOT=self.media.name)
        settings.enable()
        self.addCleanup(settings.disable)
        self.user = User.objects.create_user(username='photo-merchant', user_type='business_partner')
        self.destination = Destination.objects.get(code='KGL')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def payload(self, **overrides):
        data = {
            'business_name': 'Test Kigali Restaurant',
            'business_category': 'Restaurant',
            'destination': self.destination.id,
            'community_type': 'destination',
            'service_tags': '["dining", "local"]',
            'business_registration_number': 'TEST123',
            'business_address': 'Test address',
            'business_phone': '+250700000000',
            'business_email': 'test@example.com',
            'business_description': 'A test business profile.',
            'business_logo': image_upload('logo.jpg'),
            'business_documents': SimpleUploadedFile('registration.txt', b'Test document'),
            'photo_rights_confirmed': 'true',
            'uploaded_photos': [image_upload(), image_upload('dining.jpg')],
        }
        data.update(overrides)
        return data

    def submit(self, **overrides):
        return self.client.post('/api/business/applications/', self.payload(**overrides), format='multipart')

    def approve(self, application):
        model_admin = PartnerApplicationAdmin(PartnerApplication, AdminSite())
        with patch.object(model_admin, 'message_user'):
            model_admin.approve_applications(None, PartnerApplication.objects.filter(pk=application.pk))

    def public_ecosystem(self):
        return APIClient().get(f'/api/trip-assistant/destinations/{self.destination.id}/ecosystem/').data

    def test_multiple_photos_stay_private_until_approval_and_publish_to_selected_city(self):
        response = self.submit()
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(len(response.data['photos']), 2)
        self.assertEqual(self.public_ecosystem()['communities']['destination']['partners'], [])
        application = PartnerApplication.objects.get(pk=response.data['id'])
        self.approve(application)
        partner = Partnership.objects.get(user=self.user)
        self.assertEqual(partner.destination, self.destination)
        self.assertEqual(partner.community_type, 'destination')
        self.assertEqual(partner.service_tags, ['dining', 'local'])
        self.assertFalse(partner.is_demo)
        self.assertEqual(partner.photos.count(), 2)
        published = self.public_ecosystem()['communities']['destination']['partners'][0]
        self.assertEqual(len(published['photos']), 2)
        self.assertEqual(published['display_image'], published['photos'][0]['image'])

    def test_airport_merchant_publishes_only_to_airport_community(self):
        response = self.submit(community_type='airport')
        self.approve(PartnerApplication.objects.get(pk=response.data['id']))
        communities = self.public_ecosystem()['communities']
        self.assertEqual(len(communities['airport']['partners']), 1)
        self.assertEqual(communities['destination']['partners'], [])

    def test_photo_permission_is_required(self):
        response = self.submit(photo_rights_confirmed='false')
        self.assertEqual(response.status_code, 400)
        self.assertIn('photo_rights_confirmed', response.data)
        self.assertFalse(PartnerApplication.objects.filter(user=self.user).exists())

    def test_invalid_image_is_rejected(self):
        response = self.submit(uploaded_photos=[SimpleUploadedFile('bad.jpg', b'not an image', content_type='image/jpeg')])
        self.assertEqual(response.status_code, 400)
        self.assertIn('uploaded_photos', response.data)

    def test_unsupported_image_format_is_rejected(self):
        response = self.submit(uploaded_photos=[image_upload('animated.gif', 'GIF')])
        self.assertEqual(response.status_code, 400)

    def test_photo_count_and_size_limits(self):
        response = self.submit(uploaded_photos=[image_upload(f'{index}.jpg') for index in range(9)])
        self.assertEqual(response.status_code, 400)
        large = image_upload()
        large.size = 8 * 1024 * 1024 + 1
        from .serializers import PartnerApplicationSerializer
        from rest_framework.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            PartnerApplicationSerializer().validate_uploaded_photos([large])

    def test_approved_application_cannot_publish_unreviewed_replacement(self):
        response = self.submit()
        application = PartnerApplication.objects.get(pk=response.data['id'])
        self.approve(application)
        response = self.client.patch(f'/api/business/applications/{application.id}/', {'uploaded_photos': [image_upload('replacement.jpg')]}, format='multipart')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Partnership.objects.get(user=self.user).photos.count(), 2)

    def test_new_approval_replaces_gallery_without_resetting_financials(self):
        first = self.submit()
        self.approve(PartnerApplication.objects.get(pk=first.data['id']))
        partner = Partnership.objects.get(user=self.user)
        partner.commission_rate = '12.00'
        partner.total_bookings = 5
        partner.save()
        second = self.submit(uploaded_photos=[image_upload('new.jpg')])
        self.approve(PartnerApplication.objects.get(pk=second.data['id']))
        partner.refresh_from_db()
        self.assertEqual(partner.photos.count(), 1)
        self.assertEqual(partner.total_bookings, 5)
        self.assertEqual(str(partner.commission_rate), '12.00')
        self.assertEqual(MerchantPhoto.objects.filter(application_id=first.data['id'], partnership__isnull=True).count(), 2)

    def test_legacy_application_without_photos_is_supported(self):
        response = self.submit(uploaded_photos=[], photo_rights_confirmed='false')
        self.assertEqual(response.status_code, 201)
        self.approve(PartnerApplication.objects.get(pk=response.data['id']))
        self.assertEqual(Partnership.objects.get(user=self.user).photos.count(), 0)

    def test_cannot_view_another_merchants_application(self):
        response = self.submit()
        another = User.objects.create_user(username='another-merchant', user_type='business_partner')
        self.client.force_authenticate(another)
        self.assertEqual(self.client.get(f"/api/business/applications/{response.data['id']}/").status_code, 404)

    def test_seeded_demos_are_labeled_and_kigali_has_no_fabricated_merchants(self):
        self.assertTrue(self.destination.is_demo)
        self.assertFalse(Partnership.objects.filter(destination=self.destination).exists())
        self.assertFalse(Service.objects.filter(destination=self.destination).exists())
        self.assertTrue(Service.objects.filter(destination__code='NBO', is_demo=True).exists())
        self.assertTrue(Partnership.objects.filter(destination__code='NBO', is_demo=True).exists())

    def test_uploaded_service_photo_takes_precedence_over_stock_url(self):
        service = Service.objects.filter(destination__code='NBO').first()
        service.image = image_upload()
        service.save()
        self.assertEqual(ServiceSerializer(service).data['display_image'], service.image.url)
