from unittest.mock import patch
from sqlalchemy.orm import sessionmaker
from tests.conftest import test_engine


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_startup_seeds_and_idempotent(db):
    from app.main import startup
    from app.models.card import Card
    from app.models.quiz_question import QuizQuestion

    db.query(Card).delete()
    db.query(QuizQuestion).delete()
    db.commit()

    from app.seed import QUESTIONS
    Sess = sessionmaker(bind=test_engine, autoflush=False, autocommit=False)
    with patch("app.main.engine", test_engine), patch("app.main.SessionLocal", Sess):
        from app.seed import CARDS
        startup()
        assert db.query(Card).count() == len(CARDS)
        assert db.query(QuizQuestion).count() == len(QUESTIONS)
        startup()  # idempotent
        assert db.query(Card).count() == len(CARDS)


def test_get_db_generator(db):
    from app.database import get_db
    Sess = sessionmaker(bind=test_engine, autoflush=False, autocommit=False)
    with patch("app.database.SessionLocal", Sess):
        gen = get_db()
        session = next(gen)
        assert session is not None
        try:
            next(gen)
        except StopIteration:
            pass
