from fastapi import FastAPI
from contextlib import asynccontextmanager

from backend.db.session import Base, engine, SessionLocal
from backend.middlewares.cors import add_cors_middleware
from backend.api.auth import router as auth_router
from backend.api.challenges import router as challenges_router
from backend.api.admin import router as admin_router
from backend.api.ws import router as ws_router
from backend.api.scoreboard import router as scoreboard_router
from backend.models import User
from backend.services.auth import hash_password


Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # SQLite backfills for added columns (best-effort, ignored if already exist)
    try:
        with engine.connect() as conn:
            conn.exec_driver_sql("ALTER TABLE challenges ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT 1")
    except Exception:
        pass
    try:
        with engine.connect() as conn:
            conn.exec_driver_sql("ALTER TABLE users ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT 1")
    except Exception:
        pass
    try:
        with engine.connect() as conn:
            conn.exec_driver_sql("ALTER TABLE submissions ADD COLUMN awarded_points INTEGER")
    except Exception:
        pass
    # scoring fields
    try:
        with engine.connect() as conn:
            conn.exec_driver_sql("ALTER TABLE challenges ADD COLUMN scoring_type VARCHAR(16) NOT NULL DEFAULT 'static'")
    except Exception:
        pass
    for coldef in [
        "initial_value INTEGER",
        "decay_function VARCHAR(16)",
        "decay_value FLOAT",
        "minimum_value INTEGER",
    ]:
        try:
            with engine.connect() as conn:
                conn.exec_driver_sql(f"ALTER TABLE challenges ADD COLUMN {coldef}")
        except Exception:
            pass

    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(username="admin", password_hash=hash_password("admin"), is_admin=True)
            db.add(admin)
            db.commit()
    finally:
        db.close()

    yield

app = FastAPI(title="CTF Backend", lifespan=lifespan, docs_url=None)
add_cors_middleware(app)

app.include_router(auth_router)
app.include_router(challenges_router)
app.include_router(admin_router)
app.include_router(ws_router)
app.include_router(scoreboard_router)


@app.get("/")
def root():
    return {"status": "ok"}
