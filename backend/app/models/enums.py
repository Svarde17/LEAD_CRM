import enum
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Text, Numeric, Date, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid


class LeadStatus(str, enum.Enum):
    new = "new"
    contacted = "contacted"
    interested = "interested"
    won = "won"
    lost = "lost"


class LeadSource(str, enum.Enum):
    referral = "referral"
    linkedin = "linkedin"
    cold_call = "cold_call"
    website = "website"
    other = "other"


class Priority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
