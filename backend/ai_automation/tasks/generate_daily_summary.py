import logging
from celery import shared_task
from django.utils import timezone

from customer_support.models import CustomerMessage
from ai_automation.models import DailySummary

from ai_automation.services.ai_service import call_llm
from ai_automation.prompts.daily_summary import build_daily_summary_prompt

from notifications.tasks.send_notification import send_to_admins


logger = logging.getLogger(__name__)


@shared_task(bind=True)
def generate_daily_summary(self):

    try:
        now = timezone.now()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)

        messages = CustomerMessage.objects.filter(
            created_at__gte=start_of_day
        )

        total_messages = messages.count()
        urgent_messages = messages.filter(status="OPEN").count()

        sample_messages = "\n".join(
            f"- {m.content[:150]}" for m in messages[:20]
        )
        
        logger.info(f"Generating daily summary with {total_messages} messages.")

        prompt = build_daily_summary_prompt(
            total_messages,
            urgent_messages,
            sample_messages
        )
        logger.info(f"Daily summary prompt built: {prompt[:200]}...")
        ai_data = call_llm(
            prompt        )
        logger.info(f"AI response received for daily summary: {ai_data}")

        if not ai_data:
            logger.error("Failed to generate daily summary: AI response is empty.")
            return None

        summary = DailySummary.objects.create(
            summary_text=ai_data.get("summary_text", ""),
            total_messages=total_messages,
            urgent_issues=urgent_messages
        )
        logger.info(f"Daily summary created with ID: {summary.id}")

        message = f"""
{ai_data.get('summary_text', '')}

Insight: {ai_data.get('insight', '')}

Recommendation: {ai_data.get('recommendation', '')}

---
Total Messages: {total_messages}
Urgent Issues: {urgent_messages}
"""

        send_to_admins.delay(
            "Daily Support Summary",
            message,
            "TELEGRAM"
        )

        return summary.id

    except Exception as e:
        logger.error(f"Daily summary failed: {str(e)}")
        return None