from datetime import date
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=6, max_length=72)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MoodEntryBase(BaseModel):
    date: date
    mood: int = Field(ge=1, le=5)
    note: Optional[str] = None


class MoodEntryCreate(MoodEntryBase):
    pass


class MoodEntryUpdate(BaseModel):
    date: Optional[date] = None
    mood: Optional[int] = Field(default=None, ge=1, le=5)
    note: Optional[str] = None


class MoodEntryOut(MoodEntryBase):
    id: int
    owner_id: int
    class Config:
        from_attributes = True

class FriendInfo(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    class Config:
        from_attributes = True

class FriendRequest(BaseModel):
    friend_email: EmailStr        