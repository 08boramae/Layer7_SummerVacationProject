from sqlalchemy import Column, Integer, String, Text, DateTime, func, Boolean
from sqlalchemy.orm import relationship

from backend.db.session import Base


class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    file_path = Column(String(512), nullable=True)
    points = Column(Integer, default=100, nullable=False)
    field = Column(String(32), nullable=False)
    flag_hash = Column(String(128), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    is_visible = Column(Boolean, default=True, nullable=False)

    submissions = relationship("Submission", back_populates="challenge", cascade="all, delete-orphan") 