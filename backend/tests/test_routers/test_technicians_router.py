import pytest
from httpx import AsyncClient
from fastapi import status

from app.models.user import User, UserRole

@pytest.mark.asyncio
async def test_get_available_technicians_router(
    client: AsyncClient,
    test_gerente: User,
    gerente_headers: dict[str, str],
    create_test_user
):
    """Garante que a rota de listar técnicos disponíveis retorne os técnicos corretos quando chamada por perfil autorizado."""
    # Cria técnicos ativo e inativo
    tec_ativo = await create_test_user("777777777", "Tec Ativo", "tec_ativo@unb.br", role=UserRole.TECNICO, ativo=True)
    await create_test_user("888888888", "Tec Inativo", "tec_inativo@unb.br", role=UserRole.TECNICO, ativo=False)

    response = await client.get("/api/v1/technicians/available", headers=gerente_headers)
    
    assert response.status_code == status.HTTP_200_OK
    json_data = response.json()
    assert len(json_data) == 1
    assert json_data[0]["matricula"] == tec_ativo.matricula

@pytest.mark.asyncio
async def test_get_available_technicians_forbidden(
    client: AsyncClient,
    test_solicitante: User,
    solicitante_headers: dict[str, str]
):
    """Garante que perfis não autorizados (ex: solicitante) recebam status 403 (Forbidden) ao acessar a listagem de técnicos."""
    response = await client.get("/api/v1/technicians/available", headers=solicitante_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
