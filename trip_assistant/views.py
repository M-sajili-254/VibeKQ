from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.shortcuts import get_object_or_404
from decimal import Decimal, ROUND_HALF_UP
import uuid

from .models import Destination, ServiceCategory, Service, Booking, Review, Payment
from .recommendations import score_services_for_profile
from .serializers import (
    DestinationSerializer, ServiceCategorySerializer, ServiceSerializer,
    ServiceDetailSerializer, BookingSerializer, BookingDetailSerializer, ReviewSerializer,
    PaymentSerializer, PaymentInitiateSerializer
)
from .payment_services import mpesa_service, stripe_service
from accounts.profile_utils import get_active_destination, get_or_create_passenger_profile
from business_community.models import Partnership


class DestinationViewSet(viewsets.ModelViewSet):
    """ViewSet for Destination model"""
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'city', 'country', 'code', 'airport_name']
    ordering_fields = ['name', 'created_at', 'sort_order']

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def ecosystem(self, request, pk=None):
        destination = self.get_object()
        from business_community.models import Partnership
        from business_community.serializers import PartnershipSerializer

        airport_services = Service.objects.filter(
            destination=destination,
            community_type='airport',
            available=True,
        ).select_related('category', 'destination', 'provider')
        destination_services = Service.objects.filter(
            destination=destination,
            community_type='destination',
            available=True,
        ).select_related('category', 'destination', 'provider')
        partners = Partnership.objects.filter(destination=destination, active=True).select_related('user', 'destination')

        return Response({
            'destination': DestinationSerializer(destination).data,
            'communities': {
                'airport': {
                    'services': ServiceSerializer(airport_services, many=True).data,
                    'partners': PartnershipSerializer(partners.filter(community_type='airport'), many=True).data,
                },
                'destination': {
                    'services': ServiceSerializer(destination_services, many=True).data,
                    'partners': PartnershipSerializer(partners.filter(community_type='destination'), many=True).data,
                },
            },
        })


class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for ServiceCategory model"""
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [permissions.AllowAny]


class ServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for Service model"""
    queryset = Service.objects.filter(available=True)
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'destination__city']
    ordering_fields = ['price', 'rating', 'created_at']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ServiceDetailSerializer
        return ServiceSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category', None)
        destination = self.request.query_params.get('destination', None)
        community_type = self.request.query_params.get('community_type', None)
        journey_stage = self.request.query_params.get('journey_stage', None)
        passport_only = self.request.query_params.get('passport_only', None)
        
        if category:
            queryset = queryset.filter(category_id=category)
        if destination:
            queryset = queryset.filter(destination_id=destination)
        if community_type:
            queryset = queryset.filter(community_type=community_type)
        if journey_stage:
            queryset = queryset.filter(journey_stage=journey_stage)
        if passport_only and self.request.user.is_authenticated:
            active_destination = get_active_destination(self.request.user)
            if active_destination:
                queryset = queryset.filter(destination=active_destination)
        
        return queryset.select_related('category', 'destination', 'provider')


class BookingViewSet(viewsets.ModelViewSet):
    """ViewSet for Booking model"""
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BookingDetailSerializer
        return BookingSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for Review model"""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        service = self.request.query_params.get('service', None)
        
        if service:
            queryset = queryset.filter(service_id=service)
        
        return queryset


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Payment model"""
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class DestinationPassportView(APIView):
    """Single-destination dashboard tied to the passenger's active ticket."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        destination = get_active_destination(request.user)
        if not destination:
            return Response(
                {'error': 'No active destination passport found for this account.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        profile = get_or_create_passenger_profile(request.user)
        latest_ticket = (
            request.user.ticket_verifications.filter(linked_destination=destination)
            .select_related('linked_destination')
            .order_by('-verified_at', '-created_at')
            .first()
        )

        services = list(
            Service.objects.filter(destination=destination, available=True)
            .select_related('category', 'destination', 'provider')
        )
        ranked_services = score_services_for_profile(request.user, services)

        from business_community.serializers import PartnershipSerializer
        from accounts.serializers import PassengerProfileSerializer

        partners = Partnership.objects.filter(destination=destination, active=True).select_related('user', 'destination')
        airport_services = [service for service in ranked_services if service.community_type == 'airport']
        destination_services = [service for service in ranked_services if service.community_type == 'destination']

        return Response({
            'destination': DestinationSerializer(destination).data,
            'profile': PassengerProfileSerializer(profile).data if profile else None,
            'ticket': {
                'ticket_number': latest_ticket.ticket_number if latest_ticket else request.user.last_ticket_number,
                'flight_number': latest_ticket.flight_number if latest_ticket else None,
                'departure_date': latest_ticket.departure_date if latest_ticket else None,
                'destination': latest_ticket.destination if latest_ticket else destination.city,
            },
            'communities': {
                'airport': {
                    'services': ServiceSerializer(airport_services[:6], many=True).data,
                    'partners': PartnershipSerializer(partners.filter(community_type='airport'), many=True).data,
                },
                'destination': {
                    'services': ServiceSerializer(destination_services[:9], many=True).data,
                    'partners': PartnershipSerializer(partners.filter(community_type='destination'), many=True).data,
                },
            },
            'recommendations': ServiceSerializer(ranked_services[:8], many=True).data,
            'marketplace': {
                'bookings_count': request.user.bookings.count(),
                'payments_count': request.user.payments.count(),
                'ready_for_checkout': bool(request.user.last_ticket_number),
            },
        })


def _calculate_commission(booking):
    partnership = Partnership.objects.filter(user=booking.service.provider, active=True).first()
    rate = partnership.commission_rate if partnership else Decimal('10.00')
    amount = Decimal(booking.total_price)
    commission_amount = (amount * Decimal(rate) / Decimal('100')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    business_payout_amount = (amount - commission_amount).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    return partnership, Decimal(rate), commission_amount, business_payout_amount


def _finalize_payment(payment):
    if payment.status == 'completed':
        return

    partnership, commission_rate, commission_amount, business_payout_amount = _calculate_commission(payment.booking)
    payment.status = 'completed'
    payment.commission_rate = commission_rate
    payment.commission_amount = commission_amount
    payment.business_payout_amount = business_payout_amount
    payment.completed_at = timezone.now()
    payment.save()

    payment.booking.status = 'confirmed'
    payment.booking.save(update_fields=['status'])

    if partnership:
        partnership.total_revenue = Decimal(partnership.total_revenue) + business_payout_amount
        partnership.total_bookings += 1
        partnership.save(update_fields=['total_revenue', 'total_bookings', 'updated_at'])

    service = payment.booking.service
    service.total_bookings += 1
    service.save(update_fields=['total_bookings'])


class InitiatePaymentView(APIView):
    """API endpoint to initiate payment"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PaymentInitiateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        booking_id = serializer.validated_data['booking_id']
        payment_method = serializer.validated_data['payment_method']
        
        # Get booking
        booking = get_object_or_404(Booking, id=booking_id, user=request.user)
        
        # Check if payment already exists
        if hasattr(booking, 'payment'):
            if booking.payment.status == 'completed':
                return Response({
                    'error': 'This booking has already been paid for'
                }, status=status.HTTP_400_BAD_REQUEST)
            payment = booking.payment
            partnership, commission_rate, commission_amount, business_payout_amount = _calculate_commission(booking)
            payment.payment_method = payment_method
            payment.status = 'pending'
            payment.payment_response = None
            payment.commission_rate = commission_rate
            payment.commission_amount = commission_amount
            payment.business_payout_amount = business_payout_amount
        else:
            # Generate transaction reference
            transaction_ref = f'TXN-{uuid.uuid4().hex[:12].upper()}'
            partnership, commission_rate, commission_amount, business_payout_amount = _calculate_commission(booking)
            # Create payment record
            payment = Payment(
                booking=booking,
                user=request.user,
                amount=booking.total_price,
                currency=booking.service.currency,
                payment_method=payment_method,
                transaction_reference=transaction_ref,
                status='pending',
                commission_rate=commission_rate,
                commission_amount=commission_amount,
                business_payout_amount=business_payout_amount,
            )
        if hasattr(payment, 'transaction_reference') and not payment.transaction_reference:
            payment.transaction_reference = f'TXN-{uuid.uuid4().hex[:12].upper()}'
        transaction_ref = payment.transaction_reference
        payment.currency = booking.service.currency
        payment.save()
        
        try:
            if payment_method == 'mpesa':
                # Initiate M-Pesa STK Push
                phone_number = serializer.validated_data.get('mpesa_phone_number')
                payment.mpesa_phone_number = phone_number
                payment.save()
                
                result = mpesa_service.initiate_stk_push(
                    phone_number=phone_number,
                    amount=float(booking.total_price),
                    account_reference=transaction_ref,
                    transaction_desc=f'Payment for {booking.service.name}'
                )
                
                if result.get('success'):
                    payment.mpesa_checkout_request_id = result.get('checkout_request_id')
                    payment.status = 'processing'
                    payment.payment_response = result
                    payment.save()
                    
                    return Response({
                        'success': True,
                        'message': 'STK Push sent to your phone. Please enter your M-Pesa PIN.',
                        'payment_id': payment.id,
                        'transaction_reference': transaction_ref,
                        'commission_amount': str(payment.commission_amount),
                        'business_payout_amount': str(payment.business_payout_amount),
                        'checkout_request_id': result.get('checkout_request_id')
                    })
                else:
                    payment.status = 'failed'
                    payment.payment_response = result
                    payment.save()
                    return Response({
                        'error': result.get('error_message', 'M-Pesa payment initiation failed')
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            elif payment_method == 'card':
                # Create Stripe Payment Intent
                result = stripe_service.create_payment_intent(
                    amount=int(float(booking.total_price) * 100),  # Convert to cents
                    currency=booking.service.currency.lower(),
                    metadata={
                        'booking_id': str(booking.id),
                        'transaction_reference': transaction_ref
                    }
                )
                
                if result.get('success'):
                    payment.stripe_payment_intent_id = result.get('payment_intent_id')
                    payment.status = 'processing'
                    payment.payment_response = result
                    payment.save()
                    
                    return Response({
                        'success': True,
                        'message': 'Payment intent created',
                        'payment_id': payment.id,
                        'transaction_reference': transaction_ref,
                        'commission_amount': str(payment.commission_amount),
                        'business_payout_amount': str(payment.business_payout_amount),
                        'client_secret': result.get('client_secret'),
                        'publishable_key': stripe_service.publishable_key
                    })
                else:
                    payment.status = 'failed'
                    payment.payment_response = result
                    payment.save()
                    return Response({
                        'error': 'Card payment initiation failed'
                    }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            payment.status = 'failed'
            payment.save()
            return Response({
                'error': f'Payment initiation failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConfirmPaymentView(APIView):
    """API endpoint to confirm payment status"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, payment_id):
        payment = get_object_or_404(Payment, id=payment_id, user=request.user)
        
        if payment.status == 'completed':
            return Response({
                'success': True,
                'message': 'Payment already completed',
                'payment': PaymentSerializer(payment).data
            })
        
        try:
            if payment.payment_method == 'mpesa':
                # Query M-Pesa transaction status
                result = mpesa_service.query_transaction_status(
                    payment.mpesa_checkout_request_id
                )
                
                if result.get('success') and result.get('result_code') == '0':
                    payment.mpesa_transaction_id = result.get('transaction_id')
                    payment.save(update_fields=['mpesa_transaction_id'])
                    _finalize_payment(payment)
                    
                    return Response({
                        'success': True,
                        'message': 'Payment confirmed successfully',
                        'payment': PaymentSerializer(payment).data
                    })
                else:
                    return Response({
                        'success': False,
                        'message': 'Payment not yet completed. Please try again.'
                    })
            
            elif payment.payment_method == 'card':
                # In production, verify with Stripe webhook
                # For now, mark as completed
                _finalize_payment(payment)
                
                return Response({
                    'success': True,
                    'message': 'Payment confirmed successfully',
                    'payment': PaymentSerializer(payment).data
                })
        
        except Exception as e:
            return Response({
                'error': f'Payment confirmation failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
