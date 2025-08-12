from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.models import User, Cheer


def get_cheerboard(db: Session):
    rows = (
        db.query(User.username, func.count(Cheer.id).label("cheers"))
        .outerjoin(Cheer, Cheer.receiver_user_id == User.id)
        .filter(User.is_visible.is_(True))
        .group_by(User.id)
        .order_by(func.count(Cheer.id).desc(), User.id.asc())
        .all()
    )
    return [{"username": username, "cheers": int(cheers or 0)} for (username, cheers) in rows]
