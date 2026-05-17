from fastapi import FastAPI
from app.database import engine, SessionLocal, Base
import app.models  # noqa: F401 — регистрирует все модели
from app.seed import seed_db

app = FastAPI(title="Sports Cards API")


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok"}
