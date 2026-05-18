from sqlalchemy import Column, Integer, String, Enum as SAEnum
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class League(str, enum.Enum):
    football = "football"
    nba = "nba"
    nhl = "nhl"


class Rarity(str, enum.Enum):
    common = "common"
    rare = "rare"
    legendary = "legendary"


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    team = Column(String(128), nullable=True)
    league = Column(SAEnum(League), nullable=False)
    rarity = Column(SAEnum(Rarity), nullable=False)
    position = Column(String(20), nullable=True)
    image_url = Column(String(512), nullable=True)

    owners = relationship("UserCard", back_populates="card", cascade="all, delete-orphan")
