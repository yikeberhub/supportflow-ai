import os
import django
from django.core.mail import send_mail

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

def send_email():
    send_mail(
        subject="subject",
        message="this is message",
        from_email="yikeber50@gmail.com",
        recipient_list=["yikeber50@gmail.com"],  # also fix typo
        fail_silently=False,
    )

send_email()