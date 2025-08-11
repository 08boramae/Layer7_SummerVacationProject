from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models import User, Cheer
from backend.services.auth import get_current_user, require_admin

router = APIRouter(prefix="/cheer", tags=["cheer"])


@router.post("/{receiver_user_id}")
def send_cheer(receiver_user_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.id == receiver_user_id:
        raise HTTPException(status_code=400, detail="Cannot cheer yourself")
    target = db.query(User).filter(User.id == receiver_user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    exists = db.query(Cheer).filter(Cheer.sender_user_id == user.id, Cheer.receiver_user_id == receiver_user_id).first()
    if exists:
        raise HTTPException(status_code=400, detail="Already cheered")

    db.add(Cheer(sender_user_id=user.id, receiver_user_id=receiver_user_id))
    db.commit()
    return {"ok": True}


@router.get("/count/{user_id}")
def get_cheer_count(user_id: int, db: Session = Depends(get_db)):
    count = db.query(func.count(Cheer.id)).filter(Cheer.receiver_user_id == user_id).scalar() or 0
    return {"user_id": user_id, "cheers": int(count)}


@router.get("/admin/list", dependencies=[Depends(require_admin)])
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
