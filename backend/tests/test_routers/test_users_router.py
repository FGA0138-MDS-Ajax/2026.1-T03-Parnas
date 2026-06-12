import pytest
from httpx import AsyncClient
from fastapi import status

from app.models.user import User

@pytest.mark.asyncio
async def test_get_me_success(client: AsyncClient, test_solicitante: User, solicitante_headers: dict[str, str]):
    """Garante que a rota /me retorna os dados corretos do usuário autenticado."""
    response = await client.get("/api/v1/users/me", headers=solicitante_headers)
    
    assert response.status_code == status.HTTP_200_OK
    json_data = response.json()
    assert json_data["matricula"] == test_solicitante.matricula
    assert json_data["email"] == test_solicitante.email
    assert json_data["nome"] == test_solicitante.nome

@pytest.mark.asyncio
async def test_get_me_unauthorized(client: AsyncClient):
    """Garante que a chamada ao endpoint /me sem token ou com token inválido falha com 401."""
    # Sem header
    response = await client.get("/api/v1/users/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Token de autenticação não informado."
    assert response.json()["status_code"] == status.HTTP_401_UNAUTHORIZED

    # Token malformado
    response = await client.get("/api/v1/users/me", headers={"Authorization": "Bearer invalido"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Não foi possível validar as credenciais"
    assert response.json()["path"] == "/api/v1/users/me"
