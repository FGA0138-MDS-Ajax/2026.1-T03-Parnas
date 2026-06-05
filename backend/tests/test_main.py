from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Bem-vindo à API do KeepUnB!",
        "status": "healthy",
        "docs": "/docs",
    }


def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "keepunb-backend",
    }


def test_openapi_documents_standard_error_payload():
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schemas = response.json()["components"]["schemas"]
    assert "ErrorResponse" in schemas

    ticket_post_responses = response.json()["paths"]["/api/v1/tickets"]["post"]["responses"]
    assert "400" in ticket_post_responses
    assert "422" not in ticket_post_responses
    assert "ErrorResponse" in str(ticket_post_responses["400"])
