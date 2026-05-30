import os
import json
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
from datetime import datetime
from django.conf import settings

logger = logging.getLogger(__name__)


class TelegramService:
    
    def __init__(self):
        self.bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        self.api_url = f"https://api.telegram.org/bot{self.bot_token}"
    
    def send_message(self, chat_id: str, title: str, message: str) -> dict:
    
        if not self.bot_token:
            return {
                "success": False,
                "error": "TELEGRAM_BOT_TOKEN not configured"
            }
        
        try:
            formatted_message = f"<b>{title}</b>\n\n{message}"
            
            payload = {
                "chat_id": chat_id,
                "text": formatted_message,
                "parse_mode": "HTML"
            }
            
            response = requests.post(
                f"{self.api_url}/sendMessage",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("ok"):
                    logger.info(f"Telegram message sent to {chat_id}")
                    return {
                        "success": True,
                        "message_id": data.get("result", {}).get("message_id")
                    }
                else:
                    error_msg = data.get("description", "Unknown error")
                    logger.error(f"Telegram API error: {error_msg}")
                    return {
                        "success": False,
                        "error": error_msg
                    }
            else:
                logger.error(f"Telegram HTTP error: {response.status_code}")
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}"
                }
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Telegram request failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"Telegram service error: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }


class EmailService:
    
    def __init__(self):
        self.smtp_host = settings.EMAIL_HOST
        self.smtp_port = settings.EMAIL_PORT
        self.sender_email = settings.EMAIL_HOST_USER
        self.sender_password = settings.EMAIL_HOST_PASSWORD
        self.sender_name = settings.EMAIL_SENDER_NAME
    
    def send_email(self, recipient: str, title: str, message: str, html_content: str = None) -> dict:
       
        if not self.sender_email or not self.sender_password:
            return {
                "success": False,
                "error": "Email credentials not configured"
            }
        
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = title
            msg["From"] = f"{self.sender_name} <{self.sender_email}>"
            msg["To"] = recipient
            
            msg.attach(MIMEText(message, "plain"))
            
            if html_content:
                msg.attach(MIMEText(html_content, "html"))
            else:
                html = f"""
                <html>
                    <body>
                        <h2>{title}</h2>
                        <p>{message.replace(chr(10), '<br>')}</p>
                    </body>
                </html>
                """
                msg.attach(MIMEText(html, "html"))
            
            use_ssl = settings.EMAIL_USE_SSL
            use_tls = settings.EMAIL_USE_TLS
            
            if use_ssl:
                server = smtplib.SMTP_SSL(self.smtp_host, self.smtp_port, timeout=10)
            else:
                server = smtplib.SMTP(self.smtp_host, self.smtp_port, timeout=10)
                if use_tls:
                    server.starttls()
            
            server.login(self.sender_email, self.sender_password)
            server.send_message(msg)
            server.quit()
            
            logger.info(f"Email sent to {recipient}")
            return {
                "success": True,
                "recipient": recipient
            }
            
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"Email authentication failed: {str(e)}")
            return {
                "success": False,
                "error": "Authentication failed"
            }
        except smtplib.SMTPException as e:
            logger.error(f"SMTP error: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"Email service error: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }


class NotificationService:
    
    def __init__(self):
        self.telegram = TelegramService()
        self.email = EmailService()
    
    def send_notification(self, user, notification_type: str, recipient: str, title: str, message: str) -> tuple:
        
        if notification_type == "TELEGRAM":
            result = self.telegram.send_message(recipient, title, message)
        elif notification_type == "EMAIL":
            result = self.email.send_email(recipient, title, message)
        else:
            return False, "Invalid notification type"
        
        if result.get("success"):
            return True, None
        else:
            return False, result.get("error", "Unknown error")
    
    def send_to_user(self, user, notification_type: str, title: str, message: str) -> tuple:
        
        if notification_type == "TELEGRAM":
            if not user.telegram_chat_id:
                return False, "User has no Telegram chat ID configured"
            recipient = user.telegram_chat_id
        elif notification_type == "EMAIL":
            recipient = user.email
        else:
            return False, "Invalid notification type"
        
        return self.send_notification(user, notification_type, recipient, title, message)
