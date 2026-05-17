from app.services.auth import create_token


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
