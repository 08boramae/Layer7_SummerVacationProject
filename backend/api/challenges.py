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
from backend.api.ws import broadcast_challenges_stats_update
from backend.utils.scoring import compute_challenge_value


router = APIRouter(prefix="/challenges", tags=["challenges"])


@router.get("", response_model=List[ChallengeOut])
def list_challenges(db: Session = Depends(get_db)):
    items = db.query(Challenge).filter(Challenge.is_visible.is_(True)).order_by(Challenge.points.desc()).all()
    result = []
    for c in items:
        link: Optional[str] = f"/challenges/{c.id}/download" if c.file_path else None
        # show current value (next solver reward) for dynamic; static shows points
        if c.scoring_type == "dynamic":
            solve_count = db.query(Submission).filter(Submission.challenge_id == c.id, Submission.is_correct.is_(True)).count()
            display_points = compute_challenge_value(c, solve_count + 1)
        else:
            display_points = c.points
        result.append({
            "title": c.title,
            "content": c.content,
            "file": link,
            "points": int(display_points),
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
    c = db.query(Challenge).filter(Challenge.id == challenge_id, Challenge.is_visible.is_(True)).first()
    if not c:
        raise HTTPException(status_code=404, detail="Challenge not found")

    submitted = body.flag.strip()
    if verify_password(submitted, c.flag_hash):
        exists = db.query(Submission).filter(
            Submission.user_id == user.id,
            Submission.challenge_id == challenge_id,
            Submission.is_correct.is_(True),
        ).first()
        if exists:
            return {"success": True, "message": "Already solved"}

        # Determine solve index and award points
        correct_count = db.query(Submission).filter(
            Submission.challenge_id == challenge_id,
            Submission.is_correct.is_(True),
        ).count()
        solve_index = correct_count + 1  # 1-based order
        awarded = compute_challenge_value(c, solve_index) if c.scoring_type == "dynamic" else int(c.points)

        db.add(Submission(
            user_id=user.id,
            challenge_id=challenge_id,
            is_correct=True,
            submitted_flag_preview=submitted[:32],
            awarded_points=awarded,
        ))
        user.score += awarded
        db.commit()
        await broadcast_scoreboard(db)
        await broadcast_challenges_stats_update(db)
        return {"success": True, "message": "Correct flag", "awarded": awarded}

    db.add(Submission(
        user_id=user.id,
        challenge_id=challenge_id,
        is_correct=False,
        submitted_flag_preview=submitted[:32],
    ))
    db.commit()
    return {"success": False, "message": "Incorrect flag"} 