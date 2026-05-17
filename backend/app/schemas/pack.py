from pydantic import BaseModel
from app.models.card import League
from app.schemas.card import CardOut


class PackOpenRequest(BaseModel):
    league: League


class PackOpenResponse(BaseModel):
    card: CardOut
    tickets_balance: int
