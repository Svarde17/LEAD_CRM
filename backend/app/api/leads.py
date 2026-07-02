from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.enums import LeadStatus
from app.schemas.lead import LeadCreate, LeadUpdate, LeadResponse
from app.repositories import lead_repo
from app.services.lead_intelligence import update_lead_score, flag_cold_leads
from app.services.whatsapp import send_whatsapp
from app.services.voice import transcribe_audio
from app.ai.gemini import summarize_notes

router = APIRouter(prefix="/leads", tags=["Leads"])


@router.get("", response_model=list[LeadResponse])
def list_leads(
    search: str | None = Query(None),
    status: LeadStatus | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    flag_cold_leads(db, current_user.id)
    return lead_repo.get_leads(db, current_user.id, search, status)


@router.post("", response_model=LeadResponse, status_code=201)
def create_lead(
    payload: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = lead_repo.create_lead(db, current_user.id, payload)
    lead.last_activity_at = datetime.now(timezone.utc)
    db.commit()
    return update_lead_score(db, lead)


@router.put("/{lead_id}", response_model=LeadResponse)
def update_lead(
    lead_id: UUID,
    payload: LeadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = lead_repo.get_lead(db, lead_id, current_user.id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead = lead_repo.update_lead(db, lead, payload)
    lead.last_activity_at = datetime.now(timezone.utc)
    db.commit()
    return update_lead_score(db, lead)


@router.delete("/{lead_id}", status_code=204)
def delete_lead(
    lead_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = lead_repo.get_lead(db, lead_id, current_user.id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead_repo.delete_lead(db, lead)


@router.post("/{lead_id}/score", response_model=LeadResponse)
def score_lead(
    lead_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = lead_repo.get_lead(db, lead_id, current_user.id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return update_lead_score(db, lead)


@router.post("/{lead_id}/whatsapp")
def whatsapp_followup(
    lead_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = lead_repo.get_lead(db, lead_id, current_user.id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    if not lead.phone:
        raise HTTPException(status_code=400, detail="Lead has no phone number")

    message = f"Hi {lead.name}, just following up from our last conversation. Let me know if you have any questions!"
    sid = send_whatsapp(lead.phone, message)

    lead.last_activity_at = datetime.now(timezone.utc)
    db.commit()
    update_lead_score(db, lead)
    return {"status": "sent", "sid": sid}


@router.post("/{lead_id}/voice-note")
async def voice_note(
    lead_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = lead_repo.get_lead(db, lead_id, current_user.id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    audio_bytes = await file.read()
    transcript = transcribe_audio(audio_bytes, file.filename or "recording.webm")
    result = summarize_notes(transcript)

    lead.last_activity_at = datetime.now(timezone.utc)
    db.commit()
    update_lead_score(db, lead)

    return {"transcript": transcript, **result}
