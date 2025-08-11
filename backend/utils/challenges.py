from typing import List, Dict
from sqlalchemy.orm import Session

from backend.models import Challenge, Submission
from backend.utils.scoring import compute_challenge_value


def get_challenge_stats(db: Session) -> List[Dict]:
    items = db.query(Challenge).order_by(Challenge.id.asc()).all()
    stats: List[Dict] = []
    for c in items:
        solves = db.query(Submission).filter(
            Submission.challenge_id == c.id, Submission.is_correct.is_(True)
        ).count()
        current_value = (
            compute_challenge_value(c, solves + 1) if c.scoring_type == "dynamic" else int(c.points)
        )
        stats.append(
            {
                "id": c.id,
                "title": c.title,
                "field": c.field,
                "solves": int(solves),
                "current_value": int(current_value),
                "is_visible": bool(c.is_visible),
            }
        )
    return stats
