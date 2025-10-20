from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerApplicationViewSet, PartnershipViewSet, SponsoredContentViewSet

router = DefaultRouter()
router.register(r'applications', PartnerApplicationViewSet, basename='application')
router.register(r'partnerships', PartnershipViewSet, basename='partnership')
router.register(r'sponsored', SponsoredContentViewSet, basename='sponsored')

urlpatterns = [
    path('', include(router.urls)),
]
