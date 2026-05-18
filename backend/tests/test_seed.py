from app.seed import seed_db
from app.models.card import Card
from app.models.quiz_question import QuizQuestion


def test_seed_populates_empty_db(db):
    db.query(Card).delete()
    db.query(QuizQuestion).delete()
    db.commit()

    from app.seed import QUESTIONS
    from app.seed import CARDS
    seed_db(db)
    assert db.query(Card).count() == len(CARDS)
    assert db.query(QuizQuestion).count() == len(QUESTIONS)


def test_seed_is_idempotent(db):
    from app.seed import CARDS, QUESTIONS
    db.query(Card).delete()
    db.query(QuizQuestion).delete()
    db.commit()

    seed_db(db)
    seed_db(db)  # second call must not duplicate data
    assert db.query(Card).count() == len(CARDS)
    assert db.query(QuizQuestion).count() == len(QUESTIONS)
