from sqlalchemy.orm import Session

from backend.models import User


def get_scoreboard(db: Session):
    users = db.query(User).filter(User.is_visible.is_(True)).order_by(User.score.desc(), User.id.asc()).all()
    return [{"username": u.username, "score": u.score} for u in users] 