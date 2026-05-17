import random
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.quiz_question import QuizQuestion
from app.models.quiz_session import QuizSession
from app.schemas.quiz import QuizStartResponse, QuizSubmitRequest, QuizSubmitResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/quiz", tags=["quiz"])

REWARD_TICKETS = 10
TIME_LIMIT_SECONDS = 20


@router.post("/start", response_model=QuizStartResponse)
def start_quiz(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    questions = db.query(QuizQuestion).all()
    if not questions:
        raise HTTPException(status_code=404, detail="No questions available")
    question = random.choice(questions)
    session = QuizSession(user_id=user.id, question_id=question.id)
    db.add(session)
    db.commit()
    db.refresh(session)
    return QuizStartResponse(
        session_id=session.id,
        question_id=question.id,
        question=question.question,
        option_1=question.option_1,
        option_2=question.option_2,
        option_3=question.option_3,
        option_4=question.option_4,
        created_at=session.created_at,
    )


@router.post("/submit", response_model=QuizSubmitResponse)
def submit_quiz(
    body: QuizSubmitRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = db.get(QuizSession, body.session_id)
    if not session or session.user_id != user.id:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.is_completed:
        raise HTTPException(status_code=400, detail="Session already completed")

    question = db.get(QuizQuestion, session.question_id)
    elapsed = (datetime.now(timezone.utc) - session.created_at.replace(tzinfo=timezone.utc)).total_seconds()
    is_correct = body.selected_option == question.correct_option
    in_time = elapsed <= TIME_LIMIT_SECONDS
    tickets_earned = 0

    if is_correct and in_time:
        tickets_earned = REWARD_TICKETS
        user.tickets_balance += tickets_earned

    session.is_completed = True
    db.commit()
    db.refresh(user)

    return QuizSubmitResponse(
        correct=is_correct,
        correct_option=question.correct_option,
        tickets_earned=tickets_earned,
        tickets_balance=user.tickets_balance,
    )
