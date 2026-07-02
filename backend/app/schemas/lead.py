from pydantic import BaseModel
from datetime import date, datetime
from decimal import Decimal
import uuid
from app.models.enums import LeadStatus, LeadSource


class LeadCreate(BaseModel):
    name: str
    company: str | None = None
    email: str | None = None
    phone: str | None = None
    status: LeadStatus = LeadStatus.new
    source: LeadSource | None = None
    value: Decimal = Decimal("0")
    notes: str | None = None
    follow_up_date: date | None = None


class LeadUpdate(BaseModel):
    name: str | None = None
    company: str | None = None
    email: str | None = None
    phone: str | None = None
    status: LeadStatus | None = None
    source: LeadSource | None = None
    value: Decimal | None = None
    notes: str | None = None
    follow_up_date: date | None = None


class LeadResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    name: str
    company: str | None
    email: str | None
    phone: str | None
    status: LeadStatus
    source: LeadSource | None
    value: Decimal
    notes: str | None
    follow_up_date: date | None
    ai_score: Decimal | None
    last_activity_at: datetime | None
    is_cold: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
