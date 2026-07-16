from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    profile_image_url: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    profile_image_url: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True