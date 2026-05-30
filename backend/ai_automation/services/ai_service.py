import os
import json
import time
import random
import logging

from openai import OpenAI

logger = logging.getLogger(__name__)

# ----------------------------
# CLIENT
# ----------------------------
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    timeout=30,
    max_retries=0,  # IMPORTANT: we control retries ourselves
)

MODEL = "openai/gpt-oss-20b:free"

# ----------------------------
# VALIDATION RULES
# ----------------------------
VALID_CATEGORIES = [
    "Refund Request",
    "Order Status",
    "Product Inquiry",
    "Bug Report",
    "Billing",
    "General Inquiry",
]

VALID_PRIORITIES = ["Low", "Medium", "High", "Urgent"]

VALID_SENTIMENTS = ["Positive", "Neutral", "Frustrated", "Angry"]


# ----------------------------
# JSON PARSER
# ----------------------------
def extract_json(text: str):
    if not text:
        return None

    cleaned = text.replace("```json", "").replace("```", "").strip()

    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start == -1 or end == -1:
        return None

    try:
        return json.loads(cleaned[start:end + 1])
    except json.JSONDecodeError:
        return None


# ----------------------------
# VALIDATOR
# ----------------------------
def validate(data: dict):
    if not data:
        return None

    return {
        "category": data.get("category") if data.get("category") in VALID_CATEGORIES else "General Inquiry",
        "priority": data.get("priority") if data.get("priority") in VALID_PRIORITIES else "Medium",
        "sentiment": data.get("sentiment") if data.get("sentiment") in VALID_SENTIMENTS else "Neutral",
        "summary": data.get("summary", ""),
        "draft_reply": data.get("draft_reply", ""),
        "action_required": bool(data.get("action_required", False)),
    }


# ----------------------------
# OPTIONAL GLOBAL THROTTLE (SAFE HOOK)
# ----------------------------
def throttle():
    time.sleep(0.5)  


# ----------------------------
# CORE AI CALL
# ----------------------------
def analyze_message(prompt: str, message_id: int):

    max_retries = 2

    for attempt in range(1, max_retries + 1):

        try:
            throttle()

            logger.info(f"AI request | attempt={attempt} | message={message_id}")

            response = client.chat.completions.create(
                model=MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "Return ONLY valid JSON. No explanation.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
            )

            content = response.choices[0].message.content
            parsed = extract_json(content)
            validated = validate(parsed)

            if validated:
                return validated

            logger.warning(f"Invalid JSON | message={message_id}")

        except Exception as e:

            msg = str(e)
            logger.error(f"AI error | attempt={attempt} | message={message_id} | {msg}")

            # 429-aware backoff
            if "429" in msg:
                wait = (2 ** attempt) + random.uniform(0, 1)
            else:
                wait = 2 * attempt

            if attempt < max_retries:
                time.sleep(wait)

    return None


# ----------------------------
# DAILY SUMMARY CALL (REUSED)
# ----------------------------
def call_llm(prompt: str):

    try:
        throttle()

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "Return ONLY valid JSON."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
        )

        content = response.choices[0].message.content
        logger.info(f'content: {content}')
        return extract_json(content)

    except Exception as e:
        logger.error(f"LLM failure: {str(e)}")
        return None