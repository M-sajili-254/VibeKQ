from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import PassengerProfile
from .profile_utils import get_active_destination, get_or_create_passenger_profile

User = get_user_model()


class PassengerProfileSerializer(serializers.ModelSerializer):
    """Serializer for passenger personalization preferences."""

    current_destination_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PassengerProfile
        fields = (
            'id', 'preferred_categories', 'interests', 'travel_styles',
            'preferred_airport_services', 'preferred_local_experiences',
            'preferred_transport_modes', 'favorite_destinations',
            'preferred_budget', 'travel_frequency', 'dietary_preferences',
            'accessibility_needs', 'recommendation_notes',
            'current_destination', 'current_destination_details',
            'last_landed_at', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'current_destination_details')

    def get_current_destination_details(self, obj):
        if not obj.current_destination:
            return None
        destination = obj.current_destination
        return {
            'id': destination.id,
            'name': destination.name,
            'city': destination.city,
            'country': destination.country,
            'code': destination.code,
            'airport_name': destination.airport_name,
            'airport_code': destination.airport_code,
        }


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""

    passenger_profile = serializers.SerializerMethodField()
    active_destination = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'user_type', 'phone_number', 'profile_picture', 'bio',
            'date_of_birth', 'nationality', 'business_name',
            'business_verified', 'business_category', 'employee_id',
            'department', 'ticket_verified', 'last_ticket_number',
            'active_destination', 'passenger_profile',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'business_verified')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_passenger_profile(self, obj):
        if obj.user_type != 'passenger':
            return None
        profile = get_or_create_passenger_profile(obj)
        return PassengerProfileSerializer(profile).data

    def get_active_destination(self, obj):
        destination = get_active_destination(obj)
        if not destination:
            return None
        return {
            'id': destination.id,
            'name': destination.name,
            'city': destination.city,
            'country': destination.country,
            'code': destination.code,
            'airport_name': destination.airport_name,
            'airport_code': destination.airport_code,
        }


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label='Confirm Password')
    
    class Meta:
        model = User
        fields = (
            'username', 'email', 'password', 'password2', 'first_name',
            'last_name', 'user_type', 'phone_number', 'business_name',
            'business_category'
        )
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        if user.user_type == 'passenger':
            PassengerProfile.objects.get_or_create(user=user)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Detailed serializer for user profile"""

    passenger_profile = PassengerProfileSerializer(required=False)
    active_destination = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'user_type', 'phone_number', 'profile_picture', 'bio',
            'date_of_birth', 'nationality', 'business_name',
            'business_verified', 'business_category', 'employee_id',
            'department', 'ticket_verified', 'last_ticket_number',
            'active_destination', 'passenger_profile',
            'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'username', 'user_type', 'created_at', 'updated_at',
            'business_verified', 'ticket_verified', 'last_ticket_number',
            'active_destination',
        )

    def get_active_destination(self, obj):
        destination = get_active_destination(obj)
        if not destination:
            return None
        return {
            'id': destination.id,
            'name': destination.name,
            'city': destination.city,
            'country': destination.country,
            'code': destination.code,
            'airport_name': destination.airport_name,
            'airport_code': destination.airport_code,
        }

    def update(self, instance, validated_data):
        passenger_profile_data = validated_data.pop('passenger_profile', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if instance.user_type == 'passenger':
            profile = get_or_create_passenger_profile(instance)
            if passenger_profile_data is not None and profile is not None:
                serializer = PassengerProfileSerializer(
                    profile,
                    data=passenger_profile_data,
                    partial=True,
                    context=self.context,
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()

        return instance
