from sqlalchemy import Column, Integer, String, Boolean, DateTime, func, Text
from sqlalchemy.orm import relationship

from backend.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    is_visible = Column(Boolean, default=True, nullable=False)
    score = Column(Integer, default=0, nullable=False)

    # profile fields
    display_name = Column(String(64), nullable=True)
    description = Column(Text, nullable=True)
    country = Column(String(64), nullable=True)
    affiliation = Column(String(128), nullable=True)
    avatar_url = Column(String(512), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    submissions = relationship("Submission", back_populates="user", cascade="all, delete-orphan") 