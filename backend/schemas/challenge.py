from pydantic import BaseModel
from typing import Optional


class ChallengeOut(BaseModel):
    title: str
    content: str
    file: Optional[str]
    points: int
    field: str


class ChallengeCreate(BaseModel):
    title: str
    content: str
    points: int
    field: str
    flag: str 