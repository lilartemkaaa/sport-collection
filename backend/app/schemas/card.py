from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.card import League, Rarity


class CardOut(BaseModel):
    id: int
    name: str
    team: Optional[str] = None
    league: League
    rarity: Rarity
    position: Optional[str] = None
    image_url: Optional[str] = None

    model_config = {"from_attributes": True}


class CardCreate(BaseModel):
    name: str
    team: Optional[str] = None
    league: League
    rarity: Rarity
    position: Optional[str] = None
    image_url: Optional[str] = None


class CardUpdate(BaseModel):
    name: Optional[str] = None
    team: Optional[str] = None
    league: Optional[League] = None
    rarity: Optional[Rarity] = None
    position: Optional[str] = None
    image_url: Optional[str] = None


class CollectionItemOut(BaseModel):
    card: CardOut
    acquired_at: datetime

    model_config = {"from_attributes": True}
