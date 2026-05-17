import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models.user import User, UserRole
from app.models.card import Card, League, Rarity
from app.models.quiz_question import QuizQuestion
from app.services.auth import hash_password, create_token

test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSession = sessionmaker(bind=test_engine, autoflush=False, autocommit=False)


@pytest.fixture
def db():
    Base.metadata.create_all(bind=test_engine)
    session = TestSession()
    session.add_all([
        Card(name="FC Common", league=League.football, rarity=Rarity.common),
        Card(name="FC Rare",   league=League.football, rarity=Rarity.rare),
        Card(name="FC Leg",    league=League.football, rarity=Rarity.legendary),
        Card(name="NBA Card",  league=League.nba,      rarity=Rarity.common),
        Card(name="NHL Card",  league=League.nhl,      rarity=Rarity.common),
        QuizQuestion(question="Test?", option_1="A", option_2="B",
                     option_3="C", option_4="D", correct_option=2),
    ])
    session.commit()
    yield session
    session.close()
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def client(db):
    app.dependency_overrides[get_db] = lambda: (yield db)
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def regular_user(db):
    u = User(username="player", hashed_password=hash_password("pass123"),
             role=UserRole.user, tickets_balance=50)
    db.add(u); db.commit(); db.refresh(u)
    return u


@pytest.fixture
def admin_user(db):
    u = User(username="admin", hashed_password=hash_password("adminpass"),
             role=UserRole.admin, tickets_balance=0)
    db.add(u); db.commit(); db.refresh(u)
    return u


@pytest.fixture
def user_h(regular_user):
    return {"Authorization": f"Bearer {create_token(regular_user.id)}"}


@pytest.fixture
def admin_h(admin_user):
    return {"Authorization": f"Bearer {create_token(admin_user.id)}"}
