from datetime import date
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.followup import FollowUp
from app.models.lead import Lead
from app.models.user import User
from app.jobs.email_service import send_followup_reminder


def send_daily_reminders() -> None:
    db: Session = SessionLocal()
    try:
        today = date.today()

        # get all incomplete follow-ups due today, joined with lead and user
        rows = (
            db.query(FollowUp, Lead, User)
            .join(Lead, Lead.id == FollowUp.lead_id)
            .join(User, User.id == Lead.user_id)
            .filter(FollowUp.followup_date == today, FollowUp.completed == False)
            .all()
        )

        if not rows:
            return

        # group by user
        user_map: dict[str, dict] = {}
        for followup, lead, user in rows:
            uid = str(user.id)
            if uid not in user_map:
                user_map[uid] = {"user": user, "followups": []}
            user_map[uid]["followups"].append({
                "title": followup.title,
                "lead_name": lead.name,
                "company": lead.company,
            })

        # send one email per user
        for data in user_map.values():
            send_followup_reminder(
                to_email=data["user"].email,
                user_name=data["user"].name,
                followups=data["followups"],
            )
    finally:
        db.close()
