from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet, EventViewSet, MerchandiseViewSet, VibeMemoryViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'events', EventViewSet, basename='event')
router.register(r'merchandise', MerchandiseViewSet, basename='merchandise')
router.register(r'vibe-memories', VibeMemoryViewSet, basename='vibe-memory')

urlpatterns = [
    path('', include(router.urls)),
]
