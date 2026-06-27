from app.models.card import Card, League
from app.models.quiz_question import QuizQuestion
from app.models.user_card import UserCard


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


def test_admin_update_card(client, admin_h, db):
    card = db.query(Card).first()
    r = client.put(
        f"/api/admin/cards/{card.id}",
        headers=admin_h,
        json={"name": "Renamed", "rarity": "legendary"},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["name"] == "Renamed"
    assert body["rarity"] == "legendary"


def test_admin_update_card_not_found(client, admin_h):
    r = client.put("/api/admin/cards/99999", headers=admin_h, json={"name": "X"})
    assert r.status_code == 404


def test_admin_list_questions(client, admin_h):
    r = client.get("/api/admin/questions", headers=admin_h)
    assert r.status_code == 200
    assert len(r.json()) > 0


def test_admin_create_question(client, admin_h):
    payload = {
        "question": "Who?",
        "option_1": "A", "option_2": "B", "option_3": "C", "option_4": "D",
        "correct_option": 3,
    }
    r = client.post("/api/admin/questions", headers=admin_h, json=payload)
    assert r.status_code == 201
    body = r.json()
    assert body["question"] == "Who?"
    assert body["correct_option"] == 3
    assert "id" in body


def test_admin_create_question_invalid_option(client, admin_h):
    payload = {
        "question": "Bad?",
        "option_1": "A", "option_2": "B", "option_3": "C", "option_4": "D",
        "correct_option": 5,
    }
    r = client.post("/api/admin/questions", headers=admin_h, json=payload)
    assert r.status_code == 422


def test_admin_update_question(client, admin_h, db):
    q = db.query(QuizQuestion).first()
    r = client.put(
        f"/api/admin/questions/{q.id}",
        headers=admin_h,
        json={"question": "Updated?", "correct_option": 1},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["question"] == "Updated?"
    assert body["correct_option"] == 1


def test_admin_update_question_not_found(client, admin_h):
    r = client.put("/api/admin/questions/99999", headers=admin_h, json={"question": "X"})
    assert r.status_code == 404


def test_admin_delete_question(client, admin_h, db):
    q = QuizQuestion(question="Temp?", option_1="A", option_2="B",
                     option_3="C", option_4="D", correct_option=1)
    db.add(q); db.commit(); db.refresh(q)
    r = client.delete(f"/api/admin/questions/{q.id}", headers=admin_h)
    assert r.status_code == 204


def test_admin_delete_question_not_found(client, admin_h):
    r = client.delete("/api/admin/questions/99999", headers=admin_h)
    assert r.status_code == 404


def test_user_cannot_access_questions(client, user_h):
    r = client.get("/api/admin/questions", headers=user_h)
    assert r.status_code == 403


def test_admin_remove_card_from_collection(client, admin_h, regular_user, db):
    card = db.query(Card).filter(Card.league == League.football).first()
    db.add(UserCard(user_id=regular_user.id, card_id=card.id))
    db.commit()
    r = client.delete(
        f"/api/admin/users/{regular_user.id}/collection/{card.id}",
        headers=admin_h,
    )
    assert r.status_code == 204


def test_admin_remove_card_from_collection_not_found(client, admin_h, regular_user):
    r = client.delete(
        f"/api/admin/users/{regular_user.id}/collection/99999",
        headers=admin_h,
    )
    assert r.status_code == 404
