from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("")
def list_public_users(db: Session = Depends(get_db)):
    rows = (
        db.query(User)
        .filter(User.is_visible.is_(True))
        .order_by(User.score.desc(), User.id.asc())
        .all()
    )
    return [
        {
            "id": u.id,
            "username": u.username,
            "score": u.score,
        }
        for u in rows
    ]
