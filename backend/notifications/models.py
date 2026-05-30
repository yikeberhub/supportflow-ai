from django.db import models
from django.conf import settings


class NotificationLog(models.Model):
    
    class NotificationType(models.TextChoices):
        TELEGRAM = "TELEGRAM", "Telegram"
        EMAIL = "EMAIL", "Email"
    
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        SENT = "SENT", "Sent"
        FAILED = "FAILED", "Failed"
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    
    notification_type = models.CharField(
        max_length=20,
        choices=NotificationType.choices,
        default=NotificationType.TELEGRAM
    )
    
    recipient = models.CharField(max_length=255)  # email or telegram_chat_id
    
    title = models.CharField(max_length=255)
    
    message = models.TextField()
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    error_message = models.TextField(null=True, blank=True)
    
    sent_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.notification_type} to {self.recipient} - {self.status}"
