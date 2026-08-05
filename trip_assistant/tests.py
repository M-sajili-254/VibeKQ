from datetime import date

from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import PassengerProfile, User
from business_community.models import Partnership
from trip_assistant.models import Booking, Destination, Payment, Service


class DestinationMarketplaceBookingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='marketplace-passenger',
            email='marketplace@example.com',
            password='pass12345',
            user_type='passenger',
            passport_number='PASS998877',
            ticket_verified=True,
            last_ticket_number='1122334455',
        )
        self.primary_destination = Destination.objects.get(code='NBO')
        self.secondary_destination = Destination.objects.get(code='DXB')
        PassengerProfile.objects.create(user=self.user, current_destination=self.primary_destination)
        self.client.force_authenticate(self.user)

        self.primary_service = Service.objects.filter(destination=self.primary_destination, community_type='destination').first()
        self.secondary_service = Service.objects.filter(destination=self.secondary_destination, community_type='destination').first()

    def test_booking_is_limited_to_active_ticket_destination(self):
        response = self.client.post(
            '/api/trip-assistant/bookings/',
            {
                'service': self.secondary_service.id,
                'booking_date': date.today().isoformat(),
                'booking_time': '10:00',
                'number_of_people': 1,
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('service', response.data)

    def test_booking_in_active_destination_carries_ticket_number(self):
        response = self.client.post(
            '/api/trip-assistant/bookings/',
            {
                'service': self.primary_service.id,
                'booking_date': date.today().isoformat(),
                'booking_time': '10:00',
                'number_of_people': 2,
            },
            format='json',
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['ticket_number'], '1122334455')

    def test_card_payment_keeps_ten_percent_commission_for_vibe(self):
        booking = Booking.objects.create(
            user=self.user,
            service=self.primary_service,
            booking_date=date.today(),
            booking_time='10:00',
            number_of_people=2,
            total_price='200.00',
            ticket_number=self.user.last_ticket_number,
        )
        partnership = Partnership.objects.get(user=self.primary_service.provider)
        starting_revenue = partnership.total_revenue
        starting_total_bookings = self.primary_service.total_bookings

        initiate = self.client.post(
            '/api/trip-assistant/payments/initiate/',
            {
                'booking_id': booking.id,
                'payment_method': 'card',
            },
            format='json',
        )
        self.assertEqual(initiate.status_code, 200)
        self.assertEqual(initiate.data['commission_amount'], '20.00')
        self.assertEqual(initiate.data['business_payout_amount'], '180.00')

        confirm = self.client.post(f"/api/trip-assistant/payments/{initiate.data['payment_id']}/confirm/")
        self.assertEqual(confirm.status_code, 200)

        payment = Payment.objects.get(id=initiate.data['payment_id'])
        partnership.refresh_from_db()
        self.primary_service.refresh_from_db()

        self.assertEqual(str(payment.commission_rate), '10.00')
        self.assertEqual(str(payment.commission_amount), '20.00')
        self.assertEqual(str(payment.business_payout_amount), '180.00')
        self.assertEqual(str(partnership.total_revenue), str(starting_revenue + payment.business_payout_amount))
        self.assertEqual(self.primary_service.total_bookings, starting_total_bookings + 1)
