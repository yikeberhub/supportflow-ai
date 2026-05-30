from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerMessageViewSet

router = DefaultRouter()
router.register(r'messages', CustomerMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]