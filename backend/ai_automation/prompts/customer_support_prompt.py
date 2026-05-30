def build_customer_support_prompt(message_content):

    return f"""
Analyze this customer message:

"{message_content}"

Return ONLY JSON:
{{
  "category": "Refund Request | Order Status | Product Inquiry | Bug Report | Billing | General Inquiry",
  "priority": "Low | Medium | High | Urgent",
  "sentiment": "Positive | Neutral | Frustrated | Angry",
  "summary": "short summary",
  "draft_reply": "professional reply",
  "action_required": true
}}
"""