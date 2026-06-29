import pytest
from fastapi import HTTPException
from app.services.auth import create_token, hash_password


def test_register_success(client):
    r = client.post("/api/auth/register", json={"username": "newuser", "password": "newpass1"})
    assert r.status_code == 201
    d = r.json()
    assert d["username"] == "newuser"
    assert d["role"] == "user"
    assert d["tickets_balance"] == 0


def test_register_short_username(client):
    r = client.post("/api/auth/register", json={"username": "ab", "password": "pass123"})
    assert r.status_code == 422


def test_register_short_password(client):
    r = client.post("/api/auth/register", json={"username": "validuser", "password": "123"})
    assert r.status_code == 422


def test_register_null_byte_password(client):
    r = client.post("/api/auth/register", json={"username": "nulluser", "password": "pa\x00ss12"})
    assert r.status_code == 422


def test_hash_password_null_byte_raises_400():
    with pytest.raises(HTTPException) as exc:
        hash_password("pa\x00ss12")
    assert exc.value.status_code == 400


def test_register_cannot_set_admin_role(client, db):
    # Попытка получить роль admin через тело запроса должна провалиться,
    # а если бы и прошла — пользователь обязан остаться обычным.
    from app.models.user import User, UserRole

    r = client.post(
        "/api/auth/register",
        json={"username": "sneakyadmin", "password": "pass123", "role": "admin"},
    )
    assert r.status_code == 422

    created = db.query(User).filter(User.username == "sneakyadmin").first()
    if created is not None:
        assert created.role == UserRole.user


def test_register_duplicate(client, regular_user):
    r = client.post("/api/auth/register", json={"username": "player", "password": "pass123"})
    assert r.status_code == 400


def test_login_success(client, regular_user):
    r = client.post("/api/auth/login", json={"username": "player", "password": "pass123"})
    assert r.status_code == 200
    assert "access_token" in r.json()
    assert r.json()["token_type"] == "bearer"


def test_login_wrong_password(client, regular_user):
    r = client.post("/api/auth/login", json={"username": "player", "password": "wrong"})
    assert r.status_code == 401


def test_login_unknown_user(client):
    r = client.post("/api/auth/login", json={"username": "nobody", "password": "pass123"})
    assert r.status_code == 401


def test_me(client, regular_user, user_h):
    r = client.get("/api/auth/me", headers=user_h)
    assert r.status_code == 200
    assert r.json()["username"] == "player"


def test_invalid_token(client):
    r = client.get("/api/auth/me", headers={"Authorization": "Bearer bad.token.here"})
    assert r.status_code == 401


def test_token_user_not_found(client):
    token = create_token(99999)
    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 401
