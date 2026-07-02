from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.lead import Lead
from app.schemas.followup import FollowUpCreate, FollowUpUpdate, FollowUpResponse
from app.repositories import followup_repo

router = APIRouter(prefix="/followups", tags=["Follow-ups"])


@router.get("", response_model=list[FollowUpResponse])
def list_followups(
    due_today: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return followup_repo.get_followups(db, current_user.id, due_today)


@router.post("", response_model=FollowUpResponse, status_code=201)
def create_followup(
    payload: FollowUpCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # verify the lead belongs to the current user
    lead = db.query(Lead).filter(Lead.id == payload.lead_id, Lead.user_id == current_user.id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return followup_repo.create_followup(db, payload)


@router.put("/{followup_id}", response_model=FollowUpResponse)
def update_followup(
    followup_id: UUID,
    payload: FollowUpUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    followup = followup_repo.get_followup(db, followup_id, current_user.id)
    if not followup:
        raise HTTPException(status_code=404, detail="Follow-up not found")
    return followup_repo.update_followup(db, followup, payload)
