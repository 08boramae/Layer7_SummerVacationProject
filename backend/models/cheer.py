from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, UniqueConstraint
from backend.db.session import Base


class Cheer(Base):
    __tablename__ = "cheers"
    __table_args__ = (
        UniqueConstraint("sender_user_id", "receiver_user_id", name="uq_cheer_sender_receiver"),
    )

    id = Column(Integer, primary_key=True)
    sender_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    receiver_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
