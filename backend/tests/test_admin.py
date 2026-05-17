from app.models.card import Card


def test_admin_list_cards(client, admin_h):
    r = client.get("/api/admin/cards", headers=admin_h)
    assert r.status_code == 200
    assert len(r.json()) > 0


def test_admin_create_card(client, admin_h):
    payload = {"name": "New Star", "league": "nba", "rarity": "rare", "image_url": None}
    r = client.post("/api/admin/cards", headers=admin_h, json=payload)
    assert r.status_code == 201
    assert r.json()["name"] == "New Star"


def test_admin_delete_card(client, admin_h, db):
    card = db.query(Card).first()
    r = client.delete(f"/api/admin/cards/{card.id}", headers=admin_h)
    assert r.status_code == 204


def test_admin_delete_card_not_found(client, admin_h):
    r = client.delete("/api/admin/cards/99999", headers=admin_h)
    assert r.status_code == 404


def test_user_cannot_access_admin(client, user_h):
    r = client.get("/api/admin/cards", headers=user_h)
    assert r.status_code == 403
