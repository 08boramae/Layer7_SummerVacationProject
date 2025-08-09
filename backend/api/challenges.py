from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models import Challenge, Submission
from backend.schemas.challenge import ChallengeOut
from backend.schemas.submission import FlagSubmit
from backend.services.auth import get_current_user, verify_password
from backend.api.ws import broadcast_scoreboard


router = APIRouter(prefix="/challenges", tags=["challenges"])


@router.get("", response_model=List[ChallengeOut])
def list_challenges(db: Session = Depends(get_db)):
    items = db.query(Challenge).order_by(Challenge.points.desc()).all()
    result = []
    for c in items:
        link: Optional[str] = f"/challenges/{c.id}/download" if c.file_path else None
        result.append({
            "title": c.title,
            "content": c.content,
            "file": link,
            "points": c.points,
            "field": c.field,
        })
    return result


@router.get("/{challenge_id}/download")
def download_file(challenge_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    c = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not c or not c.file_path:
        raise HTTPException(status_code=404, detail="File not found")
    path = Path(c.file_path)
    if not path.exists():
        raise HTTPException(status_code=404, detail="File missing")
    return FileResponse(path, filename=path.name)


@router.post("/{challenge_id}/submit")
async def submit_flag(challenge_id: int, body: FlagSubmit, db: Session = Depends(get_db), user=Depends(get_current_user)):
    c = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Challenge not found")

    submitted = body.flag.strip()
    if verify_password(submitted, c.flag_hash):
        # Already solved?
        exists = db.query(Submission).filter(
            Submission.user_id == user.id,
            Submission.challenge_id == challenge_id,
            Submission.is_correct.is_(True),
        ).first()
        if exists:
            return {"success": True, "message": "Already solved"}
        # Record correct submission and update score
        db.add(Submission(
            user_id=user.id,
            challenge_id=challenge_id,
            is_correct=True,
            submitted_flag_preview=submitted[:32],
        ))
        user.score += c.points
        db.commit()
        await broadcast_scoreboard(db)
        return {"success": True, "message": "Correct flag"}

    # Record incorrect attempt
    db.add(Submission(
        user_id=user.id,
        challenge_id=challenge_id,
        is_correct=False,
        submitted_flag_preview=submitted[:32],
    ))
    db.commit()
    return {"success": False, "message": "Incorrect flag"} 