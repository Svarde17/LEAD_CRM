import json
from groq import Groq
from app.core.config import settings


def summarize_notes(raw_note: str) -> dict:
    client = Groq(api_key=settings.GROQ_API_KEY)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a CRM assistant. Always respond with valid JSON only. No markdown, no explanation.",
            },
            {
                "role": "user",
                "content": f"""Analyze these sales meeting notes and return a JSON object with exactly these fields:
{{
  "summary": "2-3 sentence summary",
  "priority": "low" or "medium" or "high",
  "action_items": ["action 1", "action 2"]
}}

Notes:
{raw_note}""",
            },
        ],
        temperature=0.3,
    )

    text = response.choices[0].message.content.strip()

    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    return json.loads(text.strip())
