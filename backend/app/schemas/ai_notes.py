from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class AINotesCreate(BaseModel):
    raw_note: str
    lead_id: UUID | None = None


class AINotesResponse(BaseModel):
    id: UUID
    user_id: UUID
    lead_id: UUID | None
    raw_note: str
    summary: str | None
    action_items: list[str] | None
    priority: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
