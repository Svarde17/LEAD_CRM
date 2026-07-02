from sqlalchemy.orm import Session
from datetime import date
from uuid import UUID
from app.models.followup import FollowUp
from app.models.lead import Lead
from app.schemas.followup import FollowUpCreate, FollowUpUpdate


def get_followups(db: Session, user_id: UUID, due_today: bool = False) -> list[FollowUp]:
    query = (
        db.query(FollowUp)
        .join(Lead, Lead.id == FollowUp.lead_id)
        .filter(Lead.user_id == user_id)
    )
    if due_today:
        query = query.filter(FollowUp.followup_date == date.today(), FollowUp.completed == False)
    return query.order_by(FollowUp.followup_date.asc()).all()


def get_followup(db: Session, followup_id: UUID, user_id: UUID) -> FollowUp | None:
    return (
        db.query(FollowUp)
        .join(Lead, Lead.id == FollowUp.lead_id)
        .filter(FollowUp.id == followup_id, Lead.user_id == user_id)
        .first()
    )


def create_followup(db: Session, payload: FollowUpCreate) -> FollowUp:
    followup = FollowUp(**payload.model_dump())
    db.add(followup)
    db.commit()
    db.refresh(followup)
    return followup


def update_followup(db: Session, followup: FollowUp, payload: FollowUpUpdate) -> FollowUp:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(followup, field, value)
    db.commit()
    db.refresh(followup)
    return followup
