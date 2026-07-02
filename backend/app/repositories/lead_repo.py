from sqlalchemy.orm import Session
from sqlalchemy import or_
from uuid import UUID
from app.models.lead import Lead
from app.models.enums import LeadStatus
from app.schemas.lead import LeadCreate, LeadUpdate


def get_leads(db: Session, user_id: UUID, search: str | None, status: LeadStatus | None) -> list[Lead]:
    query = db.query(Lead).filter(Lead.user_id == user_id)

    if search:
        term = f"%{search}%"
        query = query.filter(or_(Lead.name.ilike(term), Lead.company.ilike(term), Lead.email.ilike(term)))

    if status:
        query = query.filter(Lead.status == status)

    return query.order_by(Lead.created_at.desc()).all()


def get_lead(db: Session, lead_id: UUID, user_id: UUID) -> Lead | None:
    return db.query(Lead).filter(Lead.id == lead_id, Lead.user_id == user_id).first()


def create_lead(db: Session, user_id: UUID, payload: LeadCreate) -> Lead:
    lead = Lead(user_id=user_id, **payload.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


def update_lead(db: Session, lead: Lead, payload: LeadUpdate) -> Lead:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(lead, field, value)
    db.commit()
    db.refresh(lead)
    return lead


def delete_lead(db: Session, lead: Lead) -> None:
    db.delete(lead)
    db.commit()
