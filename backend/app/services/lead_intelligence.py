from datetime import datetime, timezone, date
from decimal import Decimal
from sqlalchemy.orm import Session
from app.models.lead import Lead
from app.models.followup import FollowUp
from app.models.enums import LeadStatus


STATUS_SCORE = {
    LeadStatus.new: 10,
    LeadStatus.contacted: 30,
    LeadStatus.interested: 60,
    LeadStatus.won: 100,
    LeadStatus.lost: 0,
}

COLD_AFTER_DAYS = 14


def compute_score(lead: Lead, followups: list[FollowUp]) -> float:
    score = 0.0

    # 1. Status progression (40 pts)
    score += STATUS_SCORE.get(lead.status, 0) * 0.4

    # 2. Deal value (20 pts) — normalize against 100k
    value = float(lead.value or 0)
    score += min(value / 100_000, 1.0) * 20

    # 3. Follow-up frequency (20 pts) — more follow-ups = more engaged
    total_fu = len(followups)
    score += min(total_fu / 5, 1.0) * 20

    # 4. Recency of last activity (20 pts) — penalize stale leads
    last = lead.last_activity_at or lead.created_at
    if last:
        if last.tzinfo is None:
            last = last.replace(tzinfo=timezone.utc)
        days_ago = (datetime.now(timezone.utc) - last).days
        recency = max(0, 1 - days_ago / 30)
        score += recency * 20

    return round(min(score, 100), 2)


def update_lead_score(db: Session, lead: Lead) -> Lead:
    followups = db.query(FollowUp).filter(FollowUp.lead_id == lead.id).all()
    lead.ai_score = Decimal(str(compute_score(lead, followups)))
    db.commit()
    db.refresh(lead)
    return lead


def flag_cold_leads(db: Session, user_id) -> None:
    leads = db.query(Lead).filter(
        Lead.user_id == user_id,
        Lead.status.notin_([LeadStatus.won, LeadStatus.lost]),
    ).all()

    for lead in leads:
        last = lead.last_activity_at or lead.created_at
        if last:
            if last.tzinfo is None:
                last = last.replace(tzinfo=timezone.utc)
            days_ago = (datetime.now(timezone.utc) - last).days
            lead.is_cold = days_ago >= COLD_AFTER_DAYS
        # recompute score too
        followups = db.query(FollowUp).filter(FollowUp.lead_id == lead.id).all()
        lead.ai_score = Decimal(str(compute_score(lead, followups)))

    db.commit()
