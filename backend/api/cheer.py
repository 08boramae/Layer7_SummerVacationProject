from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models import User, Cheer
from backend.services.auth import get_current_user
from backend.utils.cheerboard import get_cheerboard
from backend.api.ws import broadcast_cheerboard

router = APIRouter(prefix="/cheer", tags=["cheer"])


@router.post("/{receiver_user_id}")
async def send_cheer(receiver_user_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
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
    await broadcast_cheerboard(db)
    # Optional: send an announcement via WS if desired
    return {"ok": True}


@router.get("/count/{user_id}")
def get_cheer_count(user_id: int, db: Session = Depends(get_db)):
    count = db.query(func.count(Cheer.id)).filter(Cheer.receiver_user_id == user_id).scalar() or 0
    return {"user_id": user_id, "cheers": int(count)}


@router.get("/board")
def read_cheerboard(db: Session = Depends(get_db)):
    return get_cheerboard(db)


