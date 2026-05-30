import logging

from celery import shared_task

from customer_support.models import CustomerMessage
from ai_automation.models import AIAnalysis

from ai_automation.services.ai_service import analyze_message
from ai_automation.prompts.customer_support_prompt import (
    build_customer_support_prompt,
)

from notifications.tasks.send_notification import send_to_admins


logger = logging.getLogger(__name__)


@shared_task(bind=True)
def analyze_customer_message(self, message_id):

    try:
        message = CustomerMessage.objects.get(id=message_id)

        if message.is_processed:
            return None

        prompt = build_customer_support_prompt(message.content)

        ai_data = analyze_message(prompt, message_id)

        if not ai_data:
            logger.warning(f"AI returned no result | message={message_id}")
            return None

        analysis = AIAnalysis.objects.create(
            message=message,
            category=ai_data["category"],
            priority=ai_data["priority"],
            sentiment=ai_data["sentiment"],
            summary=ai_data["summary"],
            draft_reply=ai_data["draft_reply"],
            action_required=ai_data["action_required"],
        )

        message.is_processed = True
        message.save(update_fields=["is_processed"])

        if (
            ai_data["priority"] in ["High", "Urgent"]
            or ai_data["action_required"]
        ):
            send_to_admins.delay(
                f"URGENT: {ai_data['category']}",
                f"{message.content}\n\n{ai_data['draft_reply']}",
                "TELEGRAM",
            )

        return analysis.id

    except CustomerMessage.DoesNotExist:
        logger.error(f"Message not found | id={message_id}")
        return None

    except Exception as e:
        logger.error(
            f"Task failure | message={message_id} | error={str(e)}"
        )
        return None