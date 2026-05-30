from django.conf import settings
from django.core.management.base import BaseCommand

import requests
import os

bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
 
api_url = f"https://api.telegram.org/bot{bot_token}"
    
def send_telegram_message(msg:str):
    
    formatted_message = f"\n{msg}"
            
    payload = {
                "chat_id": 989429288,
                "text": formatted_message,
                "parse_mode": "HTML"
            }
            
    response = requests.post(
                f"{api_url}/sendMessage",
                json=payload,
                timeout=10
            )
    print('response:',response.json())
    
    
class Command(BaseCommand):
        def handle(self, *args, **kwargs):
            send_telegram_message("This is a test message from SupportFlow AI backend.")