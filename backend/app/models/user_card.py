from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.database import Base


class UserCard(Base):
    __tablename__ = "user_cards"
    __table_args__ = (UniqueConstraint("user_id", "card_id", name="uq_user_cards_user_id_card_id"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False)
    acquired_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="cards")
    card = relationship("Card", back_populates="owners")
