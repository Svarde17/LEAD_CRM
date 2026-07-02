import resend
from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY


def send_followup_reminder(to_email: str, user_name: str, followups: list[dict]) -> None:
    items_html = "".join(
        f"<li><strong>{f['title']}</strong> — {f['lead_name']} ({f['company'] or 'No company'})</li>"
        for f in followups
    )

    resend.Emails.send({
        "from": settings.FROM_EMAIL,
        "to": to_email,
        "subject": f"📋 You have {len(followups)} follow-up(s) due today",
        "html": f"""
        <h2>Good morning, {user_name}!</h2>
        <p>You have <strong>{len(followups)}</strong> follow-up(s) due today:</p>
        <ul>{items_html}</ul>
        <p>Log in to LeadVault to take action.</p>
        """,
    })
