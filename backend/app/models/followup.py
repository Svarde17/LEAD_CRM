from sqlalchemy import Column, String, Boolean, DateTime, Text, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.core.database import Base


class FollowUp(Base):
    __tablename__ = "followups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id", ondelete="CASCADE"), nullable=False, index=True)

    title = Column(String(200), nullable=False)
    notes = Column(Text, nullable=True)
    followup_date = Column(Date, nullable=False, index=True)
    completed = Column(Boolean, default=False)
    priority = Column(String(10), default="medium", nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lead = relationship("Lead", back_populates="followups")
