from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.utils.scoreboard import get_scoreboard


router = APIRouter(tags=["scoreboard"])


@router.get("/scoreboard")
def read_scoreboard(db: Session = Depends(get_db)):
    return get_scoreboard(db) 