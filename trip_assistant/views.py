from rest_framework import viewsets, filters, permissions
from .models import Destination, ServiceCategory, Service, Booking, Review
from .serializers import (
    DestinationSerializer, ServiceCategorySerializer, ServiceSerializer,
    ServiceDetailSerializer, BookingSerializer, BookingDetailSerializer, ReviewSerializer
)


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
