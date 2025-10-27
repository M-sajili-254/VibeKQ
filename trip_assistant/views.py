from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.shortcuts import get_object_or_404
import uuid

from .models import Destination, ServiceCategory, Service, Booking, Review, Payment
from .serializers import (
    DestinationSerializer, ServiceCategorySerializer, ServiceSerializer,
    ServiceDetailSerializer, BookingSerializer, BookingDetailSerializer, ReviewSerializer,
    PaymentSerializer, PaymentInitiateSerializer
)
from .payment_services import mpesa_service, stripe_service


class DestinationViewSet(viewsets.ModelViewSet):
    """ViewSet for Destination model"""
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'city', 'country']
    ordering_fields = ['name', 'created_at']


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
        
        if category:
            queryset = queryset.filter(category_id=category)
        if destination:
            queryset = queryset.filter(destination_id=destination)
        
        return queryset


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
        
        # Generate transaction reference
        transaction_ref = f'TXN-{uuid.uuid4().hex[:12].upper()}'
        
        # Create payment record
        payment = Payment.objects.create(
            booking=booking,
            user=request.user,
            amount=booking.total_price,
            currency='KES' if payment_method == 'mpesa' else 'USD',
            payment_method=payment_method,
            transaction_reference=transaction_ref,
            status='pending'
        )
        
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
                    currency='usd',
                    metadata={
                        'booking_id': booking.id,
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
                    payment.status = 'completed'
                    payment.mpesa_transaction_id = result.get('transaction_id')
                    payment.completed_at = timezone.now()
                    payment.save()
                    
                    # Update booking status
                    payment.booking.status = 'confirmed'
                    payment.booking.save()
                    
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
                payment.status = 'completed'
                payment.completed_at = timezone.now()
                payment.save()
                
                payment.booking.status = 'confirmed'
                payment.booking.save()
                
                return Response({
                    'success': True,
                    'message': 'Payment confirmed successfully',
                    'payment': PaymentSerializer(payment).data
                })
        
        except Exception as e:
            return Response({
                'error': f'Payment confirmation failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
