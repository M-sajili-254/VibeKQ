from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DestinationViewSet, ServiceCategoryViewSet, ServiceViewSet,
    BookingViewSet, ReviewViewSet, PaymentViewSet,
    InitiatePaymentView, ConfirmPaymentView
)

router = DefaultRouter()
router.register(r'destinations', DestinationViewSet, basename='destination')
router.register(r'categories', ServiceCategoryViewSet, basename='category')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path('payments/initiate/', InitiatePaymentView.as_view(), name='initiate-payment'),
    path('payments/<int:payment_id>/confirm/', ConfirmPaymentView.as_view(), name='confirm-payment'),
]
