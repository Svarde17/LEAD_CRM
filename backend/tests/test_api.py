from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_register_missing_fields():
    response = client.post("/auth/register", json={})
    assert response.status_code == 422


def test_login_invalid_credentials():
    response = client.post("/auth/login", json={
        "email": "nobody@test.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401


def test_leads_requires_auth():
    response = client.get("/leads")
    assert response.status_code == 401
