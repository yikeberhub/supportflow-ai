from celery import shared_task
from django.utils import timezone
from django.contrib.auth import get_user_model
from notifications.models import NotificationLog
from notifications.services import NotificationService
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


@shared_task(bind=True)
def send_telegram_notification(self, user_id: int, title: str, message: str):
 
    try:
        user = User.objects.get(id=user_id)
        service = NotificationService()
        logger.info(f"Sending Telegram notification to user {user_id}")
        notification = NotificationLog.objects.create(
            user=user,
            notification_type=NotificationLog.NotificationType.TELEGRAM,
            recipient=user.telegram_chat_id or "",
            title=title,
            message=message,
            status=NotificationLog.Status.PENDING
        )
        
        if not user.telegram_chat_id:
            notification.status = NotificationLog.Status.FAILED
            notification.error_message = "No Telegram chat ID configured"
            notification.save()
            logger.warning(f"User {user_id} has no Telegram chat ID")
            return {"success": False, "error": "No Telegram chat ID"}
        
        # Send notification
        success, error = service.send_to_user(user, "TELEGRAM", title, message)
        
        if success:
            notification.status = NotificationLog.Status.SENT
            notification.sent_at = timezone.now()
            notification.save()
            logger.info(f"Telegram notification sent to user {user_id}")
            return {"success": True}
        else:
            notification.status = NotificationLog.Status.FAILED
            notification.error_message = error
            notification.save()
            logger.error(f"Failed to send Telegram notification to user {user_id}: {error}")
            return {"success": False, "error": error}
            
    except User.DoesNotExist:
        logger.error(f"User {user_id} not found")
        return {"success": False, "error": "User not found"}
    except Exception as e:
        logger.error(f"Error sending Telegram notification: {str(e)}")
        return {"success": False, "error": str(e)}


@shared_task(bind=True)
def send_email_notification(self, user_id: int, title: str, message: str, html_content: str = None):

    try:
        user = User.objects.get(id=user_id)
        service = NotificationService()
        
        notification = NotificationLog.objects.create(
            user=user,
            notification_type=NotificationLog.NotificationType.EMAIL,
            recipient=user.email,
            title=title,
            message=message,
            status=NotificationLog.Status.PENDING
        )
        
        # Send notification
        success, error = service.send_to_user(user, "EMAIL", title, message)
        
        if success:
            notification.status = NotificationLog.Status.SENT
            notification.sent_at = timezone.now()
            notification.save()
            logger.info(f"Email notification sent to user {user_id}")
            return {"success": True}
        else:
            notification.status = NotificationLog.Status.FAILED
            notification.error_message = error
            notification.save()
            logger.error(f"Failed to send email notification to user {user_id}: {error}")
            return {"success": False, "error": error}
            
    except User.DoesNotExist:
        logger.error(f"User {user_id} not found")
        return {"success": False, "error": "User not found"}
    except Exception as e:
        logger.error(f"Error sending email notification: {str(e)}")
        return {"success": False, "error": str(e)}


@shared_task(bind=True)
def send_to_admins(self, title: str, message: str, notification_type: str = "TELEGRAM"):

    try:
        admins = User.objects.filter(role="ADMIN")
        results = []
        
        for admin in admins:
            if notification_type == "TELEGRAM":
                task = send_telegram_notification.delay(admin.id, title, message)
            else:
                task = send_email_notification.delay(admin.id, title, message)
            results.append(task.id)
        
        logger.info(f"Sent {notification_type} notifications to {len(admins)} admins")
        return {"success": True, "recipients": len(admins), "task_ids": results}
        
    except Exception as e:
        logger.error(f"Error sending notifications to admins: {str(e)}")
        return {"success": False, "error": str(e)}
