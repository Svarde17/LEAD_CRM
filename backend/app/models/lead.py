from sqlalchemy import Column, String, Boolean, DateTime, Text, Numeric, Date, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.core.database import Base
from app.models.enums import LeadStatus, LeadSource


class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    name = Column(String(100), nullable=False)
    company = Column(String(150), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)

    status = Column(Enum(LeadStatus), nullable=False, default=LeadStatus.new, index=True)
    source = Column(Enum(LeadSource), nullable=True)
    value = Column(Numeric(12, 2), default=0)

    notes = Column(Text, nullable=True)
    follow_up_date = Column(Date, nullable=True)

    ai_score = Column(Numeric(5, 2), nullable=True)
    last_activity_at = Column(DateTime(timezone=True), nullable=True)
    is_cold = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    owner = relationship("User", back_populates="leads")
    followups = relationship("FollowUp", back_populates="lead", cascade="all, delete-orphan")
    ai_notes = relationship("AINote", back_populates="lead", cascade="all, delete-orphan")
