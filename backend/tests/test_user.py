from app.models.card import Card, League
from app.models.user_card import UserCard


def test_collection_empty(client, user_h, regular_user):
    r = client.get("/api/user/collection", headers=user_h)
    assert r.status_code == 200
    assert r.json() == []


def test_collection_with_cards(client, user_h, regular_user, db):
    card = db.query(Card).filter(Card.league == League.football).first()
    db.add(UserCard(user_id=regular_user.id, card_id=card.id))
    db.commit()

    r = client.get("/api/user/collection", headers=user_h)
    assert r.status_code == 200
    assert len(r.json()) == 1
    assert r.json()[0]["name"] == card.name
