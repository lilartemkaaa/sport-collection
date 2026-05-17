import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.card import Card, Rarity
from app.models.user_card import UserCard
from app.schemas.pack import PackOpenRequest, PackOpenResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/packs", tags=["packs"])

PACK_COST = 10
RARITY_WEIGHTS = {Rarity.common: 60, Rarity.rare: 30, Rarity.legendary: 10}


def _roll_rarity() -> Rarity:
    rarities = list(RARITY_WEIGHTS.keys())
    weights = list(RARITY_WEIGHTS.values())
    return random.choices(rarities, weights=weights, k=1)[0]


@router.post("/open", response_model=PackOpenResponse)
def open_pack(
    body: PackOpenRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.tickets_balance < PACK_COST:
        raise HTTPException(status_code=400, detail="Not enough tickets")

    rarity = _roll_rarity()
    cards = db.query(Card).filter(Card.league == body.league, Card.rarity == rarity).all()

    if not cards:
        # fallback на common если legendary/rare не найдены
        cards = db.query(Card).filter(Card.league == body.league, Card.rarity == Rarity.common).all()
    if not cards:
        raise HTTPException(status_code=404, detail="No cards available for this league")

    card = random.choice(cards)
    user.tickets_balance -= PACK_COST
    db.add(UserCard(user_id=user.id, card_id=card.id))
    db.commit()
    db.refresh(user)

    return PackOpenResponse(card=card, tickets_balance=user.tickets_balance)
