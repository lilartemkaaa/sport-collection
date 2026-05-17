from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.card import Card
from app.schemas.card import CardOut, CardCreate
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


@router.delete("/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(card_id: int, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    card = db.get(Card, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    db.delete(card)
    db.commit()
