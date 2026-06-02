import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status

from app.models.user import User, UserRole

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
