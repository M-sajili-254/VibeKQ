from rest_framework import serializers
from .models import Destination, ServiceCategory, Service, Booking, Review, Payment
from accounts.serializers import UserSerializer


class DestinationSerializer(serializers.ModelSerializer):
    """Serializer for Destination model"""
    display_image = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = '__all__'

    def get_display_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            try:
                return obj.image.url
            except Exception:
                pass
        return obj.image_url or None


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
    display_image = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ('rating', 'total_bookings', 'verified')

    def get_display_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            try:
                return obj.image.url
            except Exception:
                pass
        return obj.image_url or None


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


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model"""
    booking_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('user', 'transaction_reference', 'status', 'completed_at', 'payment_response')
    
    def get_booking_details(self, obj):
        return {
            'service_name': obj.booking.service.name,
            'booking_date': obj.booking.booking_date,
            'number_of_people': obj.booking.number_of_people
        }


class PaymentInitiateSerializer(serializers.Serializer):
    """Serializer for initiating payment"""
    booking_id = serializers.CharField()  # Changed to CharField to support UUID
    payment_method = serializers.ChoiceField(choices=['mpesa', 'card'])
    mpesa_phone_number = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, data):
        if data['payment_method'] == 'mpesa' and not data.get('mpesa_phone_number'):
            raise serializers.ValidationError({
                'mpesa_phone_number': 'Phone number is required for M-Pesa payments'
            })
        return data
