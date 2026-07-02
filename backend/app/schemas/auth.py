from pydantic import BaseModel, EmailStr
from datetime import datetime
import uuid


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    avatar_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
