# SupportFlow AI - Notification System Documentation

## Overview

The Notification System in SupportFlow AI provides automated messaging to users via Telegram and Email. It supports:

- **Telegram Bot Integration**: Send real-time alerts and summaries
- **Email Notifications**: Send formatted emails with HTML support  
- **Notification Logging**: Track all sent notifications with status
- **Admin Broadcasting**: Send notifications to all admin users at once
- **Automatic Triggers**: Notifications triggered by high-priority messages and daily summaries

## Architecture

### Components

1. **NotificationLog Model** - Tracks all notification attempts
2. **Services** - Telegram and Email service implementations
3. **Celery Tasks** - Asynchronous notification sending
4. **API Views** - REST endpoints for notification management
5. **Integration Points** - Hooks in message analysis and daily summary workflows

## Database Models

### NotificationLog

```python
NotificationLog(
    user,                    # ForeignKey to User
    notification_type,       # TELEGRAM or EMAIL
    recipient,               # Chat ID or email address
    title,                   # Subject/title
    message,                 # Message body
    status,                  # PENDING, SENT, or FAILED
    error_message,           # Error details if failed
    sent_at,                 # Timestamp when sent
    created_at               # Creation timestamp
)
```

**Status Values:**
- `PENDING` - Queued for sending
- `SENT` - Successfully delivered
- `FAILED` - Failed to send

**Notification Types:**
- `TELEGRAM` - Send via Telegram Bot
- `EMAIL` - Send via SMTP

## Setup Instructions

### 1. Prerequisites

- **For Telegram:**
  - Create a Telegram bot via BotFather
  - Get your bot token
  - Get your chat ID from the bot

- **For Email:**
  - SMTP server credentials (Gmail, SendGrid, etc.)
  - For Gmail: Use [App Passwords](https://myaccount.google.com/apppasswords)

### 2. Environment Configuration

Update `.env` file:

```env
# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
EMAIL_SENDER_NAME=SupportFlow AI
```

### 3. Database Migration

```bash
# Create migration (auto-generated)
python manage.py makemigrations notifications

# Apply migration
python manage.py migrate notifications
```

The migration file is already created at:
`notifications/migrations/0001_initial.py`

### 4. Update User Model

Ensure users have Telegram chat ID (already in accounts.User):

```python
class User(AbstractUser):
    telegram_chat_id = models.CharField(max_length=100, null=True, blank=True)
```

## API Endpoints

All endpoints require authentication.

### Notification Logs

```
GET    /api/notifications/logs/               # List notifications
GET    /api/notifications/logs/{id}/          # Get notification details
GET    /api/notifications/logs/stats/         # Get statistics (admin only)
```

### Send Test Notifications

```
POST   /api/notifications/logs/send_test_telegram/    # Send test Telegram
POST   /api/notifications/logs/send_test_email/       # Send test email
```

Response:
```json
{
    "message": "Test notification sent",
    "task_id": "celery-task-id",
    "user_id": 1
}
```

### Admin Broadcasting

Requires `IsAdmin` permission.

```
POST   /api/notifications/logs/send_to_all_admins_telegram/
POST   /api/notifications/logs/send_to_all_admins_email/
```

Request:
```json
{
    "title": "Alert Title",
    "message": "Alert message content"
}
```

Response:
```json
{
    "message": "Notifications queued for sending",
    "task_id": "celery-task-id"
}
```

## Celery Tasks

### send_telegram_notification

Send Telegram message to a specific user.

```python
from notifications.tasks.send_notification import send_telegram_notification

# Async execution
task = send_telegram_notification.delay(
    user_id=1,
    title="Alert Title",
    message="Alert message"
)
```

### send_email_notification

Send email to a specific user.

```python
from notifications.tasks.send_notification import send_email_notification

task = send_email_notification.delay(
    user_id=1,
    title="Email Subject",
    message="Email body text",
    html_content="<html>...</html>"  # Optional
)
```

### send_to_admins

Send notification to all admin users.

```python
from notifications.tasks.send_notification import send_to_admins

task = send_to_admins.delay(
    title="Admin Alert",
    message="Alert message",
    notification_type="TELEGRAM"  # or "EMAIL"
)
```

## Service Usage

### Direct Service Usage

```python
from notifications.services import NotificationService

service = NotificationService()

# Send via notification type
success, error = service.send_notification(
    user=user_obj,
    notification_type="TELEGRAM",
    recipient="123456789",  # Telegram chat ID
    title="Alert",
    message="Message content"
)

# Send to user's configured contact
success, error = service.send_to_user(
    user=user_obj,
    notification_type="TELEGRAM",
    title="Alert",
    message="Message content"
)
```

### Telegram Service

```python
from notifications.services import TelegramService

telegram = TelegramService()
result = telegram.send_message(
    chat_id="123456789",
    title="Alert Title",
    message="Alert message"
)

# Result:
# {
#     "success": True/False,
#     "message_id": "...",  # if successful
#     "error": "..."        # if failed
# }
```

### Email Service

```python
from notifications.services import EmailService

email = EmailService()
result = email.send_email(
    recipient="user@example.com",
    title="Email Subject",
    message="Plain text message",
    html_content="<html>...</html>"  # Optional
)

# Result:
# {
#     "success": True/False,
#     "recipient": "user@example.com",  # if successful
#     "error": "..."                    # if failed
# }
```

## Automatic Integration

### 1. High-Priority Message Alerts

When a customer message is analyzed and marked as **High/Urgent** or requires action:

- Automatic Telegram notification sent to all admins
- Contains full message details and draft response
- Triggered in `analyze_customer_message` task

### 2. Daily Summary Notifications

When `generate_daily_summary` task completes:

- Automatic Telegram notification sent to all admins
- Contains summary stats, insights, and recommendations
- Sent at configured daily time

### 3. Integration Points

**In `ai_automation/tasks/analyse_customer_message.py`:**
```python
# Automatically sends Telegram alert if:
# - Priority is "High" or "Urgent"
# - action_required is True
if priority in ["High", "Urgent"] or action_required:
    send_to_admins.delay(notification_title, notification_message, "TELEGRAM")
```

**In `ai_automation/tasks/generate_daily_summary.py`:**
```python
# Automatically sends summary to all admins
send_to_admins.delay("Daily Support Summary", summary_message, "TELEGRAM")
```

## Telegram Bot Setup Guide

### 1. Create Bot with BotFather

1. Open Telegram and search for `@BotFather`
2. Send `/newbot`
3. Follow prompts to name your bot
4. Copy the **token** (e.g., `123456789:ABCdefGHI...`)

### 2. Get Your Chat ID

1. Send a message to your bot
2. Visit: `https://api.telegram.org/bot{TOKEN}/getUpdates`
3. Find your message and copy the `chat.id`

### 3. Configure in .env

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHI...
```

### 4. Store Chat ID in User

Admin users need Telegram chat ID set in their profile:
- Via Django admin
- Via API update
- Or set during user creation

## Email Setup Guide

### Gmail Setup (Recommended)

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select Mail and Windows Computer
4. Google will generate a 16-character password
5. Use that password in `.env`

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_SENDER_NAME=SupportFlow AI
```

### SendGrid Setup

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxx
EMAIL_SENDER_NAME=SupportFlow AI
```

### Custom SMTP Server

```env
EMAIL_HOST=mail.example.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_username
EMAIL_HOST_PASSWORD=your_password
EMAIL_SENDER_NAME=SupportFlow AI
```

## Monitoring & Troubleshooting

### View Notification Logs

**Via Django Admin:**
- Navigate to `/admin/notifications/notificationlog/`
- Filter by status, type, or date
- See error messages for failed notifications

**Via API:**
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/notifications/logs/
```

### Check Notification Statistics

```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/notifications/logs/stats/
```

Response:
```json
{
    "total": 150,
    "by_status": {
        "sent": 145,
        "failed": 5,
        "pending": 0
    },
    "by_type": {
        "telegram": 100,
        "email": 50
    }
}
```

### Common Issues

**"No Telegram chat ID configured"**
- User must have Telegram chat ID set
- Update user in Django admin: set `telegram_chat_id`

**"TELEGRAM_BOT_TOKEN not configured"**
- Check `.env` has valid token
- Restart application to reload environment

**Email not sending**
- Verify SMTP credentials in `.env`
- Check email logs: `/api/notifications/logs/` with status=FAILED
- For Gmail: ensure App Password (not regular password) is used

**Celery task not executing**
- Ensure Redis is running: `redis-cli ping` should return PONG
- Check Celery worker logs for errors
- Verify task imports in task files

## Testing

### Test Telegram Notification

```bash
curl -X POST \
  -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/notifications/logs/send_test_telegram/
```

### Test Email Notification

```bash
curl -X POST \
  -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/notifications/logs/send_test_email/
```

### Broadcast to All Admins

```bash
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Alert","message":"This is a test"}' \
  http://localhost:8000/api/notifications/logs/send_to_all_admins_telegram/
```

## Error Handling & Retry Logic

- Failed notifications are logged with error messages
- Celery can be configured for automatic retries
- Failed notifications remain in database for review
- Admins can manually resend failed notifications

## Future Enhancements

Potential improvements:

1. **SMS Notifications** - Twilio integration
2. **WhatsApp Integration** - For customer outreach
3. **Slack Integration** - For team notifications
4. **Retry Logic** - Configurable auto-retry for failed messages
5. **Notification Preferences** - User can choose notification types
6. **Scheduled Notifications** - Send at specific times
7. **Notification Templates** - Pre-defined message templates
8. **Bulk Operations** - Send to user segments

## Summary

The Notification System is fully integrated with:
- **Message Analysis**: Alerts on high-priority/urgent messages
- **Daily Summaries**: Automatic admin briefings
- **REST API**: Full CRUD operations on notification logs
- **Celery**: Asynchronous background processing
- **Logging**: Complete audit trail of all notifications

All notifications are tracked, logged, and available via the admin interface and REST API.
