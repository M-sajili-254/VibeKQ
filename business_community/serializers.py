from rest_framework import serializers
from django.db import transaction
from .models import PartnerApplication, Partnership, SponsoredContent, MerchantPhoto
from accounts.serializers import UserSerializer


class MerchantPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MerchantPhoto
        fields = ('id', 'image')


class PartnerApplicationSerializer(serializers.ModelSerializer):
    """Serializer for PartnerApplication model"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    destination_name = serializers.CharField(source='destination.city', read_only=True)
    community_label = serializers.CharField(source='get_community_type_display', read_only=True)
    photos = MerchantPhotoSerializer(many=True, read_only=True)
    uploaded_photos = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False, max_length=8)
    
    class Meta:
        model = PartnerApplication
        fields = '__all__'
        read_only_fields = ('user', 'status', 'admin_notes', 'reviewed_at')
    
    def validate_uploaded_photos(self, photos):
        for photo in photos:
            if photo.size > 8 * 1024 * 1024:
                raise serializers.ValidationError('Each photo must be 8 MB or smaller.')
            if photo.image.format not in ('JPEG', 'PNG', 'WEBP'):
                raise serializers.ValidationError('Use JPEG, PNG, or WebP photos.')
        return photos

    def validate(self, attrs):
        confirmed = attrs.get('photo_rights_confirmed', getattr(self.instance, 'photo_rights_confirmed', False))
        if attrs.get('uploaded_photos') and not confirmed:
            raise serializers.ValidationError({'photo_rights_confirmed': 'Confirm permission to publish these business photos.'})
        if self.instance and self.instance.status != 'pending':
            raise serializers.ValidationError('Reviewed applications cannot be edited. Submit a new application for review.')
        if self.instance and self.instance.photos.count() + len(attrs.get('uploaded_photos', [])) > 8:
            raise serializers.ValidationError({'uploaded_photos': 'A business profile can have at most 8 photos.'})
        if self.instance and self.instance.photos.exists() and not confirmed:
            raise serializers.ValidationError({'photo_rights_confirmed': 'Photo permission is required while photos are attached.'})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        photos = validated_data.pop('uploaded_photos', [])
        validated_data['user'] = self.context['request'].user
        application = super().create(validated_data)
        for photo in photos:
            MerchantPhoto.objects.create(application=application, image=photo)
        return application

    @transaction.atomic
    def update(self, instance, validated_data):
        photos = validated_data.pop('uploaded_photos', [])
        application = super().update(instance, validated_data)
        for photo in photos:
            MerchantPhoto.objects.create(application=application, image=photo)
        return application


class PartnershipSerializer(serializers.ModelSerializer):
    """Serializer for Partnership model"""
    user = UserSerializer(read_only=True)
    destination_name = serializers.CharField(source='destination.city', read_only=True)
    destination_country = serializers.CharField(source='destination.country', read_only=True)
    community_label = serializers.CharField(source='get_community_type_display', read_only=True)
    photos = MerchantPhotoSerializer(many=True, read_only=True)
    display_image = serializers.SerializerMethodField()

    def get_display_image(self, obj):
        photo = obj.photos.first()
        return photo.image.url if photo else None
    
    class Meta:
        model = Partnership
        fields = '__all__'
        read_only_fields = ('user', 'total_revenue', 'total_bookings', 'rating', 'commission_rate')


class SponsoredContentSerializer(serializers.ModelSerializer):
    """Serializer for SponsoredContent model"""
    partner_name = serializers.CharField(source='partner.business_name', read_only=True)
    destination_name = serializers.CharField(source='destination.city', read_only=True)
    
    class Meta:
        model = SponsoredContent
        fields = '__all__'
        read_only_fields = ('partner', 'impressions', 'clicks', 'status')
    
    def create(self, validated_data):
        validated_data['partner'] = self.context['request'].user
        return super().create(validated_data)
