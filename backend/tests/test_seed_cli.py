import sys
import runpy
from unittest.mock import patch
from sqlalchemy.orm import sessionmaker
from tests.conftest import test_engine
from app.models.card import Card
from app.models.quiz_question import QuizQuestion
from app.seed import CARDS, QUESTIONS


def test_seed_cli_main_entrypoint(db):
    db.query(Card).delete()
    db.query(QuizQuestion).delete()
    db.commit()

    Sess = sessionmaker(bind=test_engine, autoflush=False, autocommit=False)
    sys.modules.pop("app.seed_cli", None)
    with patch("app.database.SessionLocal", Sess):
        runpy.run_module("app.seed_cli", run_name="__main__")

    assert db.query(Card).count() == len(CARDS)
    assert db.query(QuizQuestion).count() == len(QUESTIONS)
