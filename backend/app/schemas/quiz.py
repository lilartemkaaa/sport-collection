from pydantic import BaseModel
from datetime import datetime


class QuizStartResponse(BaseModel):
    session_id: int
    question_id: int
    question: str
    option_1: str
    option_2: str
    option_3: str
    option_4: str
    created_at: datetime


class QuizSubmitRequest(BaseModel):
    session_id: int
    selected_option: int


class QuizSubmitResponse(BaseModel):
    correct: bool
    correct_option: int
    tickets_earned: int
    tickets_balance: int
