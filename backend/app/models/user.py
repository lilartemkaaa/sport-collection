from sqlalchemy import Column, Integer, String, Enum as SAEnum
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    user = "user"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, nullable=False, index=True)
    hashed_password = Column(String(256), nullable=False)
    role = Column(SAEnum(UserRole), nullable=False, default=UserRole.user)
    tickets_balance = Column(Integer, nullable=False, default=0)

    cards = relationship("UserCard", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("QuizSession", back_populates="user", cascade="all, delete-orphan")
