from django.core.management.base import BaseCommand
from django.core.mail import send_mail

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        send_mail(
            "Test",
            "Hello",
            "yikeber50@gmail.com",
            ["yikecyber@gmail.com"],
        )