from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from backend.core.config import get_settings


settings = get_settings()

is_sqlite = settings.SQLALCHEMY_DATABASE_URI.startswith("sqlite")
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    connect_args={"check_same_thread": False} if is_sqlite else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 