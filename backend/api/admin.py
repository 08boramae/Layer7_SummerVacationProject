from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from backend.core.config import STORAGE_DIR
from backend.db.session import get_db
from backend.models import Challenge, User
from backend.services.auth import require_admin, hash_password
from backend.api.ws import broadcast_challenges_update, broadcast_scoreboard


router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])


@router.post("/challenges")
async def create_challenge(
    title: str = Form(...),
    content: str = Form(...),
    points: int = Form(...),
    field: str = Form(...),
    flag: str = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    existing = db.query(Challenge).filter(Challenge.title == title).first()
    if existing:
        raise HTTPException(status_code=400, detail="Title already exists")

    file_path: Optional[str] = None
    if file is not None:
        STORAGE_DIR.mkdir(parents=True, exist_ok=True)
        dest = STORAGE_DIR / f"{title}_{file.filename}"
        data = await file.read()
        dest.write_bytes(data)
        file_path = dest.as_posix()

    ch = Challenge(
        title=title,
        content=content,
        points=points,
        field=field,
        flag_hash=hash_password(flag),
        file_path=file_path,
    )
    db.add(ch)
    db.commit()
    db.refresh(ch)

    await broadcast_challenges_update({
        "event": "created",
        "challenge": {
            "id": ch.id,
            "title": ch.title,
            "points": ch.points,
            "field": ch.field,
        }
    })

    return {"id": ch.id}


@router.get("/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.score.desc()).all()
    return [{"id": u.id, "username": u.username, "score": u.score, "is_admin": u.is_admin} for u in users]


@router.patch("/users/{user_id}")
async def update_user(user_id: int, is_admin: Optional[bool] = None, reset_score: bool = False, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if is_admin is not None:
        user.is_admin = is_admin
    if reset_score:
        user.score = 0
    db.commit()

    await broadcast_scoreboard(db)

    return {"id": user.id, "is_admin": user.is_admin, "score": user.score} 