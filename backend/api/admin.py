from typing import Optional, List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import func, cast, Integer
from sqlalchemy.orm import Session

from backend.core.config import STORAGE_DIR
from backend.db.session import get_db
from backend.models import Challenge, User, Submission, Cheer
from backend.services.auth import require_admin, hash_password
from backend.api.ws import broadcast_challenges_update, broadcast_scoreboard
from backend.api.ws import broadcast_challenges_stats_update, broadcast_announcement
from backend.utils.scoring import compute_challenge_value


router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])


@router.post("/challenges")
async def create_challenge(
    title: str = Form(...),
    content: str = Form(...),
    points: int = Form(100),
    field: str = Form(...),
    flag: str = Form(...),
    is_visible: bool = Form(True),
    scoring_type: str = Form("static"),  # static | dynamic
    initial_value: Optional[int] = Form(None),
    decay_function: Optional[str] = Form(None),  # linear | logarithmic
    decay_value: Optional[float] = Form(None),
    minimum_value: Optional[int] = Form(None),
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
        is_visible=is_visible,
        scoring_type=scoring_type,
        initial_value=initial_value,
        decay_function=decay_function,
        decay_value=decay_value,
        minimum_value=minimum_value,
    )
    db.add(ch)
    db.commit()
    db.refresh(ch)

    await broadcast_challenges_update({
        "event": "created",
        "challenge": {"id": ch.id, "title": ch.title, "points": ch.points, "field": ch.field}
    })
    await broadcast_challenges_stats_update(db)

    return {"id": ch.id}


@router.get("/challenges")
def list_challenges_admin(db: Session = Depends(get_db)):
    subq = db.query(
        Submission.challenge_id,
        func.sum(cast(Submission.is_correct, Integer)).label("solves"),
    ).group_by(Submission.challenge_id).subquery()
    rows = (
        db.query(
            Challenge.id,
            Challenge.title,
            Challenge.field,
            Challenge.points,
            Challenge.is_visible,
            Challenge.scoring_type,
            Challenge.initial_value,
            Challenge.decay_function,
            Challenge.decay_value,
            Challenge.minimum_value,
            func.coalesce(subq.c.solves, 0).label("solves"),
        )
        .outerjoin(subq, subq.c.challenge_id == Challenge.id)
        .order_by(Challenge.id.asc())
        .all()
    )
    result = []
    for r in rows:
        # compute current display value for dynamic
        current_value = r.points
        if r.scoring_type == "dynamic":
            dummy = Challenge(points=r.points, scoring_type=r.scoring_type, initial_value=r.initial_value, decay_function=r.decay_function, decay_value=r.decay_value, minimum_value=r.minimum_value)
            current_value = compute_challenge_value(dummy, int(r.solves) + 1)
        result.append({
            "id": r.id,
            "title": r.title,
            "field": r.field,
            "points": int(current_value),
            "is_visible": r.is_visible,
            "scoring_type": r.scoring_type,
            "initial_value": r.initial_value,
            "decay_function": r.decay_function,
            "decay_value": r.decay_value,
            "minimum_value": r.minimum_value,
            "solves": int(r.solves or 0),
        })
    return result


@router.patch("/challenges/{challenge_id}")
async def update_challenge(
    challenge_id: int,
    title: Optional[str] = None,
    content: Optional[str] = None,
    points: Optional[int] = None,
    field: Optional[str] = None,
    flag: Optional[str] = None,
    is_visible: Optional[bool] = None,
    scoring_type: Optional[str] = None,
    initial_value: Optional[int] = None,
    decay_function: Optional[str] = None,
    decay_value: Optional[float] = None,
    minimum_value: Optional[int] = None,
    db: Session = Depends(get_db),
):
    ch = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")
    if title is not None:
        dup = db.query(Challenge).filter(Challenge.title == title, Challenge.id != challenge_id).first()
        if dup:
            raise HTTPException(status_code=400, detail="Title already exists")
        ch.title = title
    if content is not None:
        ch.content = content
    if points is not None:
        ch.points = points
    if field is not None:
        ch.field = field
    if flag is not None:
        ch.flag_hash = hash_password(flag)
    if is_visible is not None:
        ch.is_visible = is_visible
    if scoring_type is not None:
        ch.scoring_type = scoring_type
    if initial_value is not None:
        ch.initial_value = initial_value
    if decay_function is not None:
        ch.decay_function = decay_function
    if decay_value is not None:
        ch.decay_value = decay_value
    if minimum_value is not None:
        ch.minimum_value = minimum_value
    db.commit()

    await broadcast_challenges_update({"event": "updated", "challenge_id": challenge_id})
    await broadcast_challenges_stats_update(db)
    return {"status": True}


@router.delete("/challenges/{challenge_id}")
async def delete_challenge(challenge_id: int, db: Session = Depends(get_db)):
    ch = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")
    db.delete(ch)
    db.commit()
    await broadcast_challenges_update({"event": "deleted", "challenge_id": challenge_id})
    await broadcast_challenges_stats_update(db)
    return {"status": True}


@router.get("/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.id.asc()).all()
    return [{"id": u.id, "username": u.username, "score": u.score, "is_admin": u.is_admin, "is_visible": u.is_visible} for u in users]


@router.patch("/users/{user_id}")
async def update_user(
    user_id: int,
    is_admin: Optional[bool] = None,
    is_visible: Optional[bool] = None,
    new_password: Optional[str] = None,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if is_admin is not None:
        user.is_admin = is_admin
    if is_visible is not None:
        user.is_visible = is_visible
    if new_password is not None and new_password.strip():
        user.password_hash = hash_password(new_password)
    db.commit()
    await broadcast_scoreboard(db)
    return {"id": user.id, "is_admin": user.is_admin, "is_visible": user.is_visible}

@router.delete("/users/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"status": True}


@router.post("/announce")
async def create_announcement(message: str = Form(...)):
    await broadcast_announcement(message)
    return {"status": True} 

@router.get("/cheer/list", dependencies=[Depends(require_admin)])
def list_cheers_admin(db: Session = Depends(get_db)):
    rows = db.query(Cheer).order_by(Cheer.created_at.desc()).all()
    return [
        {
            "id": c.id,
            "sender_user_id": c.sender_user_id,
            "receiver_user_id": c.receiver_user_id,
            "created_at": c.created_at.isoformat(),
        }
        for c in rows
    ]
