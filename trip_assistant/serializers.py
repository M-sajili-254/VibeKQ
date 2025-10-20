from rest_framework import serializers
from .models import Destination, ServiceCategory, Service, Booking, Review
from accounts.serializers import UserSerializer


class DestinationSerializer(serializers.ModelSerializer):
    """Serializer for Destination model"""
    
    class Meta:
        model = Destination
        fields = '__all__'


class ServiceCategorySerializer(serializers.ModelSerializer):
    """Serializer for ServiceCategory model"""
    services_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceCategory
        fields = '__all__'
    
    def get_services_count(self, obj):
        return obj.services.count()


class ServiceSerializer(serializers.ModelSerializer):
    """Serializer for Service model"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    destination_name = serializers.CharField(source='destination.city', read_only=True)
    provider_name = serializers.CharField(source='provider.business_name', read_only=True)
    
    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ('rating', 'total_bookings', 'verified')


class ServiceDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Service model"""
    category = ServiceCategorySerializer(read_only=True)
    destination = DestinationSerializer(read_only=True)
    provider = UserSerializer(read_only=True)
    reviews = serializers.SerializerMethodField()
    
    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ('rating', 'total_bookings', 'verified')
    
    def get_reviews(self, obj):
        reviews = obj.reviews.all()[:5]
        return ReviewSerializer(reviews, many=True).data


class BookingSerializer(serializers.ModelSerializer):
    """Serializer for Booking model"""
    service_name = serializers.CharField(source='service.name', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('user', 'status', 'total_price')
    
    def create(self, validated_data):
        # Calculate total price
        service = validated_data['service']
        number_of_people = validated_data.get('number_of_people', 1)
        validated_data['total_price'] = service.price * number_of_people
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class BookingDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Booking model"""
    service = ServiceSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_profile_picture = serializers.ImageField(source='user.profile_picture', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('user',)
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
