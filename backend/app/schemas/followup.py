from pydantic import BaseModel
from datetime import date, datetime
from uuid import UUID


class FollowUpCreate(BaseModel):
    lead_id: UUID
    title: str
    notes: str | None = None
    followup_date: date
    priority: str = "medium"


class FollowUpUpdate(BaseModel):
    title: str | None = None
    notes: str | None = None
    followup_date: date | None = None
    completed: bool | None = None
    priority: str | None = None


class FollowUpResponse(BaseModel):
    id: UUID
    lead_id: UUID
    title: str
    notes: str | None
    followup_date: date
    completed: bool
    priority: str
    created_at: datetime

    model_config = {"from_attributes": True}
