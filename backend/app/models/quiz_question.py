from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String(512), nullable=False)
    option_1 = Column(String(256), nullable=False)
    option_2 = Column(String(256), nullable=False)
    option_3 = Column(String(256), nullable=False)
    option_4 = Column(String(256), nullable=False)
    correct_option = Column(Integer, nullable=False)

    sessions = relationship("QuizSession", back_populates="question")
