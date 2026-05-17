from datetime import datetime, timedelta

from app.models.quiz_question import QuizQuestion
from app.models.quiz_session import QuizSession
from app.models.user import User, UserRole
from app.services.auth import hash_password, create_token


def test_start_quiz(client, user_h):
    r = client.post("/api/quiz/start", headers=user_h)
    assert r.status_code == 200
    d = r.json()
    assert "session_id" in d
    assert "correct_option" not in d


def test_start_quiz_no_questions(client, user_h, db):
    db.query(QuizQuestion).delete()
    db.commit()
    r = client.post("/api/quiz/start", headers=user_h)
    assert r.status_code == 404


def test_submit_correct_in_time(client, user_h, db, regular_user):
    s = client.post("/api/quiz/start", headers=user_h).json()
    q = db.get(QuizQuestion, s["question_id"])
    r = client.post("/api/quiz/submit", headers=user_h,
                    json={"session_id": s["session_id"], "selected_option": q.correct_option})
    assert r.status_code == 200
    assert r.json()["correct"] is True
    assert r.json()["tickets_earned"] == 10


def test_submit_incorrect(client, user_h, db):
    s = client.post("/api/quiz/start", headers=user_h).json()
    q = db.get(QuizQuestion, s["question_id"])
    wrong = (q.correct_option % 4) + 1
    r = client.post("/api/quiz/submit", headers=user_h,
                    json={"session_id": s["session_id"], "selected_option": wrong})
    assert r.json()["correct"] is False
    assert r.json()["tickets_earned"] == 0


def test_submit_correct_out_of_time(client, user_h, db):
    s = client.post("/api/quiz/start", headers=user_h).json()
    qs = db.get(QuizSession, s["session_id"])
    qs.created_at = datetime.utcnow() - timedelta(seconds=30)
    db.commit()

    q = db.get(QuizQuestion, s["question_id"])
    r = client.post("/api/quiz/submit", headers=user_h,
                    json={"session_id": s["session_id"], "selected_option": q.correct_option})
    assert r.json()["tickets_earned"] == 0


def test_submit_already_completed(client, user_h):
    s = client.post("/api/quiz/start", headers=user_h).json()
    payload = {"session_id": s["session_id"], "selected_option": 1}
    client.post("/api/quiz/submit", headers=user_h, json=payload)
    r = client.post("/api/quiz/submit", headers=user_h, json=payload)
    assert r.status_code == 400


def test_submit_session_not_found(client, user_h):
    r = client.post("/api/quiz/submit", headers=user_h,
                    json={"session_id": 99999, "selected_option": 1})
    assert r.status_code == 404


def test_submit_wrong_user_session(client, user_h, db):
    q = db.query(QuizQuestion).first()
    other = User(username="other", hashed_password=hash_password("x" * 6),
                 role=UserRole.user, tickets_balance=0)
    db.add(other); db.commit(); db.refresh(other)
    qs = QuizSession(user_id=other.id, question_id=q.id)
    db.add(qs); db.commit(); db.refresh(qs)

    r = client.post("/api/quiz/submit", headers=user_h,
                    json={"session_id": qs.id, "selected_option": 1})
    assert r.status_code == 404
