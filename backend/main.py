from fastapi import FastAPI

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

app = FastAPI(title="CTF Backend")
add_cors_middleware(app)

app.include_router(auth_router)
app.include_router(challenges_router)
app.include_router(admin_router)
app.include_router(ws_router)
app.include_router(scoreboard_router)


@app.on_event("startup")
def ensure_admin_user():
    # Backfill Challenge.is_visible column for SQLite (no Alembic yet)
    try:
        with engine.connect() as conn:
            conn.exec_driver_sql("ALTER TABLE challenges ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT 1")
    except Exception:
        pass  # column likely exists

    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(username="admin", password_hash=hash_password("admin"), is_admin=True)
            db.add(admin)
            db.commit()
    finally:
        db.close()


@app.get("/")
def root():
    return {"status": "ok"}
