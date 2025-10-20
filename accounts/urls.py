from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from .api_views import signin, signup

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('signin/', signin, name='signin'),
    path('signup/', signup, name='signup'),
    path('', include(router.urls)),
]
