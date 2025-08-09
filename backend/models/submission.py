from sqlalchemy import Column, Integer, ForeignKey, Boolean, DateTime, func, String, UniqueConstraint
from sqlalchemy.orm import relationship

from backend.db.session import Base


class Submission(Base):
    __tablename__ = "submissions"
    __table_args__ = (
        UniqueConstraint("user_id", "challenge_id", "is_correct", name="uq_user_challenge_correct"),
    )

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id", ondelete="CASCADE"), nullable=False, index=True)
    is_correct = Column(Boolean, default=False, nullable=False)
    submitted_flag_preview = Column(String(64), nullable=True)
    awarded_points = Column(Integer, nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="submissions")
    challenge = relationship("Challenge", back_populates="submissions") 