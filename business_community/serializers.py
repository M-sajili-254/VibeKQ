from rest_framework import serializers
from .models import PartnerApplication, Partnership, SponsoredContent
from accounts.serializers import UserSerializer


class PartnerApplicationSerializer(serializers.ModelSerializer):
    """Serializer for PartnerApplication model"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = PartnerApplication
        fields = '__all__'
        read_only_fields = ('user', 'status', 'admin_notes', 'reviewed_at')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class PartnershipSerializer(serializers.ModelSerializer):
    """Serializer for Partnership model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Partnership
        fields = '__all__'
        read_only_fields = ('user', 'total_revenue', 'total_bookings', 'rating')


class SponsoredContentSerializer(serializers.ModelSerializer):
    """Serializer for SponsoredContent model"""
    partner_name = serializers.CharField(source='partner.business_name', read_only=True)
    
    class Meta:
        model = SponsoredContent
        fields = '__all__'
        read_only_fields = ('partner', 'impressions', 'clicks', 'status')
    
    def create(self, validated_data):
        validated_data['partner'] = self.context['request'].user
        return super().create(validated_data)
