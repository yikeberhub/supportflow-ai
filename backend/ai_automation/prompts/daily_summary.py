def build_daily_summary_prompt(total_messages, urgent_messages, sample_messages):

    return f"""
You are an AI support analytics system.

Generate a structured daily business summary.

DATA:
- Total messages: {total_messages}
- Urgent messages: {urgent_messages}

Sample messages:
{sample_messages}

Return ONLY valid JSON:
{{
  "summary_text": "",
  "insight": "",
  "recommendation": ""
}}
"""