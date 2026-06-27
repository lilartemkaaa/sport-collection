from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.user_card import UserCard
from app.schemas.card import CardOut, CollectionItemOut
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("/collection", response_model=List[CardOut])
def get_collection(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = (
        db.query(UserCard)
        .options(joinedload(UserCard.card))
        .filter(UserCard.user_id == user.id)
        .all()
    )
    return [row.card for row in rows]


@router.get("/collection/detailed", response_model=List[CollectionItemOut])
def get_collection_detailed(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = (
        db.query(UserCard)
        .options(joinedload(UserCard.card))
        .filter(UserCard.user_id == user.id)
        .all()
    )
    return rows
