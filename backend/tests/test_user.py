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


def test_collection_detailed_empty(client, user_h, regular_user):
    r = client.get("/api/user/collection/detailed", headers=user_h)
    assert r.status_code == 200
    assert r.json() == []


def test_collection_detailed_with_cards(client, user_h, regular_user, db):
    card = db.query(Card).filter(Card.league == League.football).first()
    db.add(UserCard(user_id=regular_user.id, card_id=card.id))
    db.commit()

    r = client.get("/api/user/collection/detailed", headers=user_h)
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 1
    assert data[0]["card"]["name"] == card.name
    assert data[0]["acquired_at"] is not None
