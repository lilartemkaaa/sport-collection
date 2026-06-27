from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.card import Card
from app.models.user_card import UserCard
from app.schemas.card import CardOut, CardCreate, CardUpdate
from app.services.auth import require_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/cards", response_model=List[CardOut])
def list_cards(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Card).all()


@router.post("/cards", response_model=CardOut, status_code=status.HTTP_201_CREATED)
def create_card(body: CardCreate, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    card = Card(**body.model_dump())
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


@router.put("/cards/{card_id}", response_model=CardOut)
def update_card(card_id: int, body: CardUpdate, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    card = db.get(Card, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(card, field, value)
    db.commit()
    db.refresh(card)
    return card


@router.delete("/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(card_id: int, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    card = db.get(Card, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    db.delete(card)
    db.commit()


@router.delete("/users/{user_id}/collection/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_card_from_collection(
    user_id: int,
    card_id: int,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    row = (
        db.query(UserCard)
        .filter(UserCard.user_id == user_id, UserCard.card_id == card_id)
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="Card not in user collection")
    db.delete(row)
    db.commit()
