from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from common.permissions import IsAdmin

from .models import NotificationLog
from .serializers import NotificationLogSerializer, NotificationLogDetailSerializer
from .tasks.send_notification import (
    send_telegram_notification,
    send_email_notification,
    send_to_admins
)

User = get_user_model()


class NotificationLogViewSet(viewsets.ReadOnlyModelViewSet):
    
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationLogSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == "ADMIN":
            return NotificationLog.objects.all()
        
        return NotificationLog.objects.filter(user=user)
    
    def get_serializer_class(self):
        if self.action == "retrieve":
            return NotificationLogDetailSerializer
        return NotificationLogSerializer
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def send_test_telegram(self, request):
        
        if not request.user.telegram_chat_id:
            return Response(
                {"error": "User has no Telegram chat ID configured yikke"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        task = send_telegram_notification.delay(
            request.user.id,
            title="Test Notification from SupportFlow AI",
            message="This is a test notification. If you received this, your Telegram integration is working!"
        )
        
        return Response({
            "message": "Test notification sent",
            "task_id": task.id,
            "user_id": request.user.id
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def send_test_email(self, request):
        # Trigger Celery task
        task = send_email_notification.delay(
            request.user.id,
            title="Test Notification from SupportFlow AI",
            message="This is a test email notification. If you received this, your email integration is working!"
        )
        
        return Response({
            "message": "Test email sent",
            "task_id": task.id,
            "user_id": request.user.id
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def send_to_all_admins_telegram(self, request):
        
        title = request.data.get("title", "Admin Notification")
        message = request.data.get("message", "")
        
        if not message:
            return Response(
                {"error": "Message is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        task = send_to_admins.delay(title, message, "TELEGRAM")
        
        return Response({
            "message": "Notifications queued for sending",
            "task_id": task.id
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def send_to_all_admins_email(self, request):
        
        title = request.data.get("title", "Admin Notification")
        message = request.data.get("message", "")
        
        if not message:
            return Response(
                {"error": "Message is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        task = send_to_admins.delay(title, message, "EMAIL")
        
        return Response({
            "message": "Emails queued for sending",
            "task_id": task.id
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsAdmin])
    def stats(self, request):
        
        total = NotificationLog.objects.count()
        sent = NotificationLog.objects.filter(status="SENT").count()
        failed = NotificationLog.objects.filter(status="FAILED").count()
        pending = NotificationLog.objects.filter(status="PENDING").count()
        
        telegram = NotificationLog.objects.filter(notification_type="TELEGRAM").count()
        email = NotificationLog.objects.filter(notification_type="EMAIL").count()
        
        return Response({
            "total": total,
            "by_status": {
                "sent": sent,
                "failed": failed,
                "pending": pending
            },
            "by_type": {
                "telegram": telegram,
                "email": email
            }
        })

