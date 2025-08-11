from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models import User
from backend.services.auth import get_current_user
from backend.schemas.user import UserProfileOut, UserProfileUpdate

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


@router.get("/{user_id}", response_model=UserProfileOut)
def get_public_profile(user_id: int, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.id == user_id, User.is_visible.is_(True)).first()
    if not u:
        # Do not leak existence; simply return 404-like
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": u.id,
        "username": u.username,
        "display_name": u.display_name,
        "description": u.description,
        "country": u.country,
        "affiliation": u.affiliation,
        "avatar_url": u.avatar_url,
    }


@router.get("/me/profile", response_model=UserProfileOut)
def get_my_profile(current=Depends(get_current_user)):
    u = current
    return {
        "id": u.id,
        "username": u.username,
        "display_name": u.display_name,
        "description": u.description,
        "country": u.country,
        "affiliation": u.affiliation,
        "avatar_url": u.avatar_url,
    }


@router.patch("/me/profile", response_model=UserProfileOut)
def update_my_profile(body: UserProfileUpdate, db: Session = Depends(get_db), current=Depends(get_current_user)):
    u = db.query(User).filter(User.id == current.id).first()
    if body.display_name is not None:
        u.display_name = body.display_name
    if body.description is not None:
        u.description = body.description
    if body.country is not None:
        u.country = body.country
    if body.affiliation is not None:
        u.affiliation = body.affiliation
    if body.avatar_url is not None:
        u.avatar_url = body.avatar_url
    db.commit()
    return {
        "id": u.id,
        "username": u.username,
        "display_name": u.display_name,
        "description": u.description,
        "country": u.country,
        "affiliation": u.affiliation,
        "avatar_url": u.avatar_url,
    }
