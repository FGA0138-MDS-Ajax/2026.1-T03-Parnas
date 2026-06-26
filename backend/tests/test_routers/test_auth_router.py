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
    assert "Email ou senha incorretos" in response.json()["detail"]
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


@pytest.mark.asyncio
async def test_register_solicitante_router_success(client: AsyncClient):
    """Garante que a rota de registro do solicitante com dados válidos retorna token JWT com 200 OK."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "matricula": "987654321",
            "nome": "Pedro Aluno",
            "email": "pedro@unb.br",
            "senha": "senha_segura_123",
            "role": "SOLICITANTE"
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    json_data = response.json()
    assert json_data["token_type"] == "bearer"
    assert "access_token" in json_data


@pytest.mark.asyncio
async def test_register_tecnico_router_success(client: AsyncClient):
    """Garante que a rota de registro do técnico com dados válidos retorna 202 Accepted sem token."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "nome": "Mário Técnico",
            "email": "mario@unb.br",
            "senha": "senha_segura_123",
            "role": "TECNICO",
            "area_manutencao": "Hidráulica"
        }
    )
    
    assert response.status_code == status.HTTP_202_ACCEPTED
    json_data = response.json()
    assert "Aguarde a aprovação" in json_data["detail"]


@pytest.mark.asyncio
async def test_register_solicitante_validation_error(client: AsyncClient):
    """Garante que cadastro de solicitante sem matrícula falhe na validação (HTTP 400 formatado)."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "nome": "Pedro Sem Matricula",
            "email": "sem_matricula@unb.br",
            "senha": "senha_segura_123",
            "role": "SOLICITANTE"
        }
    )
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    json_data = response.json()
    assert json_data["detail"] == "Falha na validação dos dados enviados."
    assert any("Matrícula é obrigatória" in err["message"] for err in json_data["errors"])


@pytest.mark.asyncio
async def test_register_tecnico_validation_error(client: AsyncClient):
    """Garante que cadastro de técnico sem área de manutenção falhe na validação (HTTP 400 formatado)."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "nome": "Mário Sem Area",
            "email": "sem_area@unb.br",
            "senha": "senha_segura_123",
            "role": "TECNICO"
        }
    )
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    json_data = response.json()
    assert json_data["detail"] == "Falha na validação dos dados enviados."
    assert any("Área de manutenção é obrigatória" in err["message"] for err in json_data["errors"])


@pytest.mark.asyncio
async def test_register_invalid_role_router(client: AsyncClient):
    """Garante que tentativa de cadastro de gerente ou administrador pela rota pública falhe (HTTP 400 formatado)."""
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "nome": "Tentativa Gerente",
            "email": "gerente_tentativa@unb.br",
            "senha": "senha_segura_123",
            "role": "GERENTE"
        }
    )
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    json_data = response.json()
    assert json_data["detail"] == "Falha na validação dos dados enviados."
    assert any("Perfil de usuário inválido" in err["message"] for err in json_data["errors"])

