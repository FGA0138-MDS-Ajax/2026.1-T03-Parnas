import pytest
from httpx import AsyncClient
from fastapi import status

from app.models.user import UserRole

@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, create_test_user):
    """Garante que a rota de login retorna token JWT com dados corretos."""
    await create_test_user(
        matricula="123456789",
        nome="João Aluno",
        email="joao@unb.br",
        senha="minhasenhateste",
        role=UserRole.SOLICITANTE,
        ativo=True
    )

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "joao@unb.br", "senha": "minhasenhateste"}
    )
    
    assert response.status_code == status.HTTP_200_OK
    json_data = response.json()
    assert json_data["token_type"] == "bearer"
    assert "access_token" in json_data

@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient, create_test_user):
    """Garante que login com credenciais erradas retorna status 401."""
    await create_test_user(
        matricula="123456789",
        nome="João Aluno",
        email="joao@unb.br",
        senha="minhasenhateste",
        role=UserRole.SOLICITANTE,
        ativo=True
    )

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "joao@unb.br", "senha": "senha_errada"}
    )
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Email ou senha incorretos"
    assert response.json()["status_code"] == status.HTTP_401_UNAUTHORIZED
    assert response.json()["path"] == "/api/v1/auth/login"


@pytest.mark.asyncio
async def test_login_validation_error_returns_standard_payload(client: AsyncClient):
    """Garante que campos obrigatórios ausentes retornem 400 com falhas explícitas."""
    response = await client.post("/api/v1/auth/login", json={"email": "joao@unb.br"})

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    json_data = response.json()
    assert json_data["detail"] == "Falha na validação dos dados enviados."
    assert json_data["status_code"] == status.HTTP_400_BAD_REQUEST
    assert json_data["path"] == "/api/v1/auth/login"
    assert {
        "field": "body.senha",
        "message": "Campo obrigatório.",
        "type": "missing",
    } in json_data["errors"]
