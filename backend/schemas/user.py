from pydantic import BaseModel
from typing import Optional


class UserOut(BaseModel):
    id: int
    username: str
    score: int
    is_admin: bool

    class Config:
        orm_mode = True


class UserScore(BaseModel):
    username: str
    score: int


class UserProfileOut(BaseModel):
    id: int
    username: str
    display_name: Optional[str] = None
    description: Optional[str] = None
    country: Optional[str] = None
    affiliation: Optional[str] = None
    avatar_url: Optional[str] = None


class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    description: Optional[str] = None
    country: Optional[str] = None
    affiliation: Optional[str] = None
    avatar_url: Optional[str] = None 