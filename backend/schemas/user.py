from pydantic import BaseModel


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