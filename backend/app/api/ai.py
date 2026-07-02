from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.ai_note import AINote
from app.schemas.ai_notes import AINotesCreate, AINotesResponse
from app.ai.gemini import summarize_notes

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/summarize", response_model=AINotesResponse, status_code=201)
def summarize(
    payload: AINotesCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        result = summarize_notes(payload.raw_note)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=502, detail=f"AI error: {str(e)}")

    note = AINote(
        user_id=current_user.id,
        lead_id=payload.lead_id,
        raw_note=payload.raw_note,
        summary=result.get("summary"),
        action_items=result.get("action_items"),
        priority=result.get("priority"),
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.get("/notes", response_model=list[AINotesResponse])
def list_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(AINote)
        .filter(AINote.user_id == current_user.id)
        .order_by(AINote.created_at.desc())
        .all()
    )
