from unittest.mock import patch

from app.models.card import Card, League, Rarity


def test_open_pack_success(client, user_h, regular_user):
    r = client.post("/api/packs/open", headers=user_h, json={"league": "football"})
    assert r.status_code == 200
    d = r.json()
    assert d["card"]["league"] == "football"
    assert d["tickets_balance"] == 40


def test_open_pack_not_enough_tickets(client, user_h, regular_user, db):
    regular_user.tickets_balance = 5
    db.commit()
    r = client.post("/api/packs/open", headers=user_h, json={"league": "football"})
    assert r.status_code == 400


def test_open_pack_fallback_to_common(client, user_h, db):
    db.query(Card).filter(Card.league == League.football,
                          Card.rarity == Rarity.legendary).delete()
    db.commit()
    with patch("app.api.packs._roll_rarity", return_value=Rarity.legendary):
        r = client.post("/api/packs/open", headers=user_h, json={"league": "football"})
    assert r.status_code == 200
    assert r.json()["card"]["rarity"] == "common"


def test_open_pack_no_cards_404(client, user_h, db):
    db.query(Card).filter(Card.league == League.nba).delete()
    db.commit()
    r = client.post("/api/packs/open", headers=user_h, json={"league": "nba"})
    assert r.status_code == 404
