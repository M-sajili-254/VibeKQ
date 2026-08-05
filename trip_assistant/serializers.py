from rest_framework import serializers
from .models import Destination, ServiceCategory, Service, Booking, Review, Payment
from accounts.serializers import UserSerializer
from accounts.profile_utils import get_active_destination


class DestinationSerializer(serializers.ModelSerializer):
    """Serializer for Destination model"""
    display_image = serializers.SerializerMethodField()
    airport_services_count = serializers.SerializerMethodField()
    destination_services_count = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = (
            'id', 'name', 'code', 'country', 'city', 'description',
            'airport_code', 'airport_name', 'currency_code', 'timezone',
            'hero_tagline', 'highlights', 'before_arrival_tips',
            'after_arrival_tips', 'is_demo', 'sort_order', 'image',
            'image_url', 'display_image', 'featured',
            'airport_services_count', 'destination_services_count',
            'created_at', 'updated_at',
        )

    def get_display_image(self, obj):
        # Prefer external URL (works on all environments)
        if obj.image_url:
            return obj.image_url
        if obj.image and hasattr(obj.image, 'url'):
            try:
                return obj.image.url
            except Exception:
                pass
        return None

    def get_airport_services_count(self, obj):
        return obj.services.filter(community_type='airport', available=True).count()

    def get_destination_services_count(self, obj):
        return obj.services.filter(community_type='destination', available=True).count()


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
    destination_country = serializers.CharField(source='destination.country', read_only=True)
    provider_name = serializers.CharField(source='provider.business_name', read_only=True)
    display_image = serializers.SerializerMethodField()
    community_label = serializers.CharField(source='get_community_type_display', read_only=True)
    journey_stage_label = serializers.CharField(source='get_journey_stage_display', read_only=True)
    recommendation_score = serializers.SerializerMethodField()
    recommendation_reasons = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = (
            'id', 'name', 'category', 'category_name', 'destination',
            'destination_name', 'destination_country', 'provider',
            'provider_name', 'description', 'community_type',
            'community_label', 'journey_stage', 'journey_stage_label',
            'location_label', 'tags', 'priority_score', 'price',
            'currency', 'image', 'image_url', 'display_image',
            'verified', 'rating', 'total_bookings', 'available',
            'recommendation_score', 'recommendation_reasons',
            'created_at', 'updated_at',
        )
        read_only_fields = ('rating', 'total_bookings', 'verified')

    def get_display_image(self, obj):
        if obj.image_url:
            return obj.image_url
        if obj.image and hasattr(obj.image, 'url'):
            try:
                return obj.image.url
            except Exception:
                pass
        return None

    def get_recommendation_score(self, obj):
        return getattr(obj, 'recommendation_score', None)

    def get_recommendation_reasons(self, obj):
        return getattr(obj, 'recommendation_reasons', [])


class ServiceDetailSerializer(ServiceSerializer):
    """Detailed serializer for Service model"""
    category = ServiceCategorySerializer(read_only=True)
    destination = DestinationSerializer(read_only=True)
    provider = UserSerializer(read_only=True)
    reviews = serializers.SerializerMethodField()
    
    class Meta(ServiceSerializer.Meta):
        fields = ServiceSerializer.Meta.fields + ('reviews',)
        read_only_fields = ServiceSerializer.Meta.read_only_fields
    
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
        read_only_fields = ('user', 'status', 'total_price', 'ticket_number')

    def validate(self, attrs):
        request = self.context['request']
        active_destination = get_active_destination(request.user)
        service = attrs['service']

        if active_destination and service.destination_id != active_destination.id:
            raise serializers.ValidationError({
                'service': 'Your active ticket only grants access to services in your linked destination.'
            })
        return attrs

    def create(self, validated_data):
        # Calculate total price
        service = validated_data['service']
        number_of_people = validated_data.get('number_of_people', 1)
        validated_data['total_price'] = service.price * number_of_people
        validated_data['user'] = self.context['request'].user
        validated_data['ticket_number'] = self.context['request'].user.last_ticket_number
        return super().create(validated_data)


class BookingDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Booking model"""
    service_name = serializers.CharField(source='service.name', read_only=True)
    destination_name = serializers.CharField(source='service.destination.city', read_only=True)
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
            'number_of_people': obj.booking.number_of_people,
            'destination_name': obj.booking.service.destination.city,
            'community_type': obj.booking.service.community_type,
            'commission_rate': obj.commission_rate,
            'commission_amount': obj.commission_amount,
            'business_payout_amount': obj.business_payout_amount,
            'ticket_number': obj.booking.ticket_number,
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
