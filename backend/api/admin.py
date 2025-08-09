from typing import Optional, List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import func, cast, Integer
from sqlalchemy.orm import Session

from backend.core.config import STORAGE_DIR
from backend.db.session import get_db
from backend.models import Challenge, User, Submission
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
        "challenge": {"id": ch.id, "title": ch.title, "points": ch.points, "field": ch.field}
    })

    return {"id": ch.id}


@router.get("/challenges")
def list_challenges_admin(db: Session = Depends(get_db)):
    subq = db.query(Submission.challenge_id, func.sum(func.cast(Submission.is_correct, Integer)).label("solves")).group_by(Submission.challenge_id).subquery()
    # Use Integer import locally to avoid circular import at top
    from sqlalchemy import Integer
    rows = (
        db.query(
            Challenge.id,
            Challenge.title,
            Challenge.field,
            Challenge.points,
            Challenge.is_visible,
            func.coalesce(subq.c.solves, 0).label("solves"),
        )
        .outerjoin(subq, subq.c.challenge_id == Challenge.id)
        .order_by(Challenge.id.asc())
        .all()
    )
    return [
        {
            "id": r.id,
            "title": r.title,
            "field": r.field,
            "points": r.points,
            "is_visible": r.is_visible,
            "solves": int(r.solves or 0),
        }
        for r in rows
    ]


@router.patch("/challenges/{challenge_id}")
async def update_challenge(challenge_id: int, title: Optional[str] = None, content: Optional[str] = None, points: Optional[int] = None, field: Optional[str] = None, flag: Optional[str] = None, is_visible: Optional[bool] = None, db: Session = Depends(get_db)):
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
    db.commit()

    await broadcast_challenges_update({"event": "updated", "challenge_id": challenge_id})
    return {"ok": True}


@router.delete("/challenges/{challenge_id}")
async def delete_challenge(challenge_id: int, db: Session = Depends(get_db)):
    ch = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")
    db.delete(ch)
    db.commit()
    await broadcast_challenges_update({"event": "deleted", "challenge_id": challenge_id})
    return {"ok": True}


@router.get("/submissions")
def list_submissions(limit: int = 200, db: Session = Depends(get_db)):
    rows = (
        db.query(Submission)
        .order_by(Submission.submitted_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": s.id,
            "user_id": s.user_id,
            "challenge_id": s.challenge_id,
            "is_correct": s.is_correct,
            "submitted_flag_preview": s.submitted_flag_preview,
            "submitted_at": s.submitted_at.isoformat(),
        }
        for s in rows
    ]


@router.delete("/submissions")
async def reset_submissions(user_id: Optional[int] = None, challenge_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Submission)
    if user_id is not None:
        q = q.filter(Submission.user_id == user_id)
    if challenge_id is not None:
        q = q.filter(Submission.challenge_id == challenge_id)
    deleted = q.delete(synchronize_session=False)

    # Recalculate user scores affected
    users = db.query(User).all()
    for u in users:
        total = (
            db.query(func.coalesce(func.sum(Challenge.points), 0))
            .join(Submission, Submission.challenge_id == Challenge.id)
            .filter(Submission.user_id == u.id, Submission.is_correct.is_(True))
            .scalar()
        )
        u.score = int(total or 0)
    db.commit()

    await broadcast_scoreboard(db)

    return {"deleted": deleted}


@router.post("/users")
async def create_user(username: str = Form(...), password: str = Form(...), is_admin: bool = Form(False), db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    u = User(username=username, password_hash=hash_password(password), is_admin=is_admin)
    db.add(u)
    db.commit()
    db.refresh(u)
    return {"id": u.id}


@router.delete("/users/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(u)
    db.commit()
    await broadcast_scoreboard(db)
    return {"ok": True}


@router.post("/scoreboard/recalc")
async def recalc_scoreboard(db: Session = Depends(get_db)):
    users = db.query(User).all()
    for u in users:
        total = (
            db.query(func.coalesce(func.sum(Challenge.points), 0))
            .join(Submission, Submission.challenge_id == Challenge.id)
            .filter(Submission.user_id == u.id, Submission.is_correct.is_(True))
            .scalar()
        )
        u.score = int(total or 0)
    db.commit()
    await broadcast_scoreboard(db)
    return {"ok": True} 