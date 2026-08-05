from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PartnerApplication, Partnership, SponsoredContent
from .serializers import PartnerApplicationSerializer, PartnershipSerializer, SponsoredContentSerializer


class PartnerApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for PartnerApplication model"""
    serializer_class = PartnerApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type == 'admin':
            return PartnerApplication.objects.all()
        return PartnerApplication.objects.filter(user=self.request.user)


class PartnershipViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Partnership model"""
    queryset = Partnership.objects.filter(active=True)
    serializer_class = PartnershipSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        destination = self.request.query_params.get('destination')
        community_type = self.request.query_params.get('community_type')

        if destination:
            queryset = queryset.filter(destination_id=destination)
        if community_type:
            queryset = queryset.filter(community_type=community_type)

        return queryset.select_related('user', 'destination')


class SponsoredContentViewSet(viewsets.ModelViewSet):
    """ViewSet for SponsoredContent model"""
    serializer_class = SponsoredContentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = SponsoredContent.objects.all()
        destination = self.request.query_params.get('destination')
        community_type = self.request.query_params.get('community_type')
        if self.action == 'list':
            queryset = queryset.filter(status='active')
        elif self.request.user.is_authenticated and self.request.user.user_type == 'business_partner':
            queryset = queryset.filter(partner=self.request.user)
        if destination:
            queryset = queryset.filter(destination_id=destination)
        if community_type:
            queryset = queryset.filter(community_type=community_type)
        return queryset
