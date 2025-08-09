import os
from functools import lru_cache
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
DB_DIR = BASE_DIR / "db"
DB_DIR.mkdir(parents=True, exist_ok=True)
STORAGE_DIR = BASE_DIR / "storage" / "challenges"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)


class Settings:
    PROJECT_NAME: str = "CTF Backend"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-change-me") # 이부분 바꾸기 change change
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_MINUTES", "60"))
    SQLALCHEMY_DATABASE_URI: str = os.getenv("DATABASE_URL", f"sqlite:///{(DB_DIR / 'app.db').as_posix()}")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings() 