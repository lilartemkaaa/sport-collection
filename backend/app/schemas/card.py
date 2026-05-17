from pydantic import BaseModel
from typing import Optional
from app.models.card import League, Rarity


class CardOut(BaseModel):
    id: int
    name: str
    league: League
    rarity: Rarity
    image_url: Optional[str] = None

    model_config = {"from_attributes": True}


class CardCreate(BaseModel):
    name: str
    league: League
    rarity: Rarity
    image_url: Optional[str] = None
