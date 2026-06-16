from httpx import AsyncClient
from fastapi import status
import pytest

from app.models.user import User, UserRole, ApprovalStatus

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


@pytest.mark.asyncio
async def test_get_pending_technicians_router(
    client: AsyncClient,
    gerente_headers: dict[str, str],
    create_test_user
):
    """Garante que a rota de listar técnicos pendentes retorne apenas os técnicos corretos para o gerente."""
    tec_pendente = await create_test_user(
        "777777777", "Tec Pendente", "tec_p@unb.br",
        role=UserRole.TECNICO, ativo=False, approval_status=ApprovalStatus.PENDENTE
    )
    await create_test_user(
        "888888888", "Tec Aprovado", "tec_a@unb.br",
        role=UserRole.TECNICO, ativo=True, approval_status=ApprovalStatus.APROVADO
    )

    response = await client.get("/api/v1/technicians/pending", headers=gerente_headers)
    assert response.status_code == status.HTTP_200_OK
    json_data = response.json()
    assert len(json_data) == 1
    assert json_data[0]["matricula"] == tec_pendente.matricula


@pytest.mark.asyncio
async def test_get_pending_technicians_router_forbidden(
    client: AsyncClient,
    solicitante_headers: dict[str, str]
):
    """Garante que um solicitante não consiga listar técnicos pendentes."""
    response = await client.get("/api/v1/technicians/pending", headers=solicitante_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.asyncio
async def test_approve_technician_router_success(
    client: AsyncClient,
    gerente_headers: dict[str, str],
    create_test_user
):
    """Garante que um gerente consegue aprovar um técnico pendente com sucesso."""
    tec = await create_test_user(
        "777777777", "Tec Pendente", "tec_p@unb.br",
        role=UserRole.TECNICO, ativo=False, approval_status=ApprovalStatus.PENDENTE
    )

    response = await client.patch(f"/api/v1/technicians/{tec.id}/approve", headers=gerente_headers)
    assert response.status_code == status.HTTP_200_OK
    json_data = response.json()
    assert json_data["ativo"] is True
    assert json_data["approval_status"] == ApprovalStatus.APROVADO.value


@pytest.mark.asyncio
async def test_approve_technician_router_forbidden(
    client: AsyncClient,
    solicitante_headers: dict[str, str],
    create_test_user
):
    """Garante que um solicitante não consegue aprovar um técnico."""
    tec = await create_test_user(
        "777777777", "Tec Pendente", "tec_p@unb.br",
        role=UserRole.TECNICO, ativo=False, approval_status=ApprovalStatus.PENDENTE
    )

    response = await client.patch(f"/api/v1/technicians/{tec.id}/approve", headers=solicitante_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.asyncio
async def test_approve_technician_router_not_found(
    client: AsyncClient,
    gerente_headers: dict[str, str]
):
    """Garante erro 404 ao tentar aprovar técnico que não existe."""
    response = await client.patch("/api/v1/technicians/9999/approve", headers=gerente_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Técnico não encontrado."


@pytest.mark.asyncio
async def test_approve_technician_router_invalid_role(
    client: AsyncClient,
    gerente_headers: dict[str, str],
    create_test_user
):
    """Garante erro 400 ao tentar aprovar usuário que não é técnico."""
    solic = await create_test_user("111111112", "Solicitante", "solic2@unb.br", role=UserRole.SOLICITANTE)
    
    response = await client.patch(f"/api/v1/technicians/{solic.id}/approve", headers=gerente_headers)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "O usuário informado não é um técnico."


@pytest.mark.asyncio
async def test_reject_technician_router_success(
    client: AsyncClient,
    gerente_headers: dict[str, str],
    create_test_user
):
    """Garante que um gerente consegue reprovar um técnico pendente com sucesso."""
    tec = await create_test_user(
        "777777777", "Tec Pendente", "tec_p@unb.br",
        role=UserRole.TECNICO, ativo=False, approval_status=ApprovalStatus.PENDENTE
    )

    response = await client.patch(f"/api/v1/technicians/{tec.id}/reject", headers=gerente_headers)
    assert response.status_code == status.HTTP_200_OK
    json_data = response.json()
    assert json_data["ativo"] is False
    assert json_data["approval_status"] == ApprovalStatus.REPROVADO.value


@pytest.mark.asyncio
async def test_reject_technician_router_forbidden(
    client: AsyncClient,
    solicitante_headers: dict[str, str],
    create_test_user
):
    """Garante que um solicitante não consegue reprovar um técnico."""
    tec = await create_test_user(
        "777777777", "Tec Pendente", "tec_p@unb.br",
        role=UserRole.TECNICO, ativo=False, approval_status=ApprovalStatus.PENDENTE
    )

    response = await client.patch(f"/api/v1/technicians/{tec.id}/reject", headers=solicitante_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.asyncio
async def test_reject_technician_router_not_found(
    client: AsyncClient,
    gerente_headers: dict[str, str]
):
    """Garante erro 404 ao tentar reprovar técnico que não existe."""
    response = await client.patch("/api/v1/technicians/9999/reject", headers=gerente_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Técnico não encontrado."


@pytest.mark.asyncio
async def test_reject_technician_router_invalid_role(
    client: AsyncClient,
    gerente_headers: dict[str, str],
    create_test_user
):
    """Garante erro 400 ao tentar reprovar usuário que não é técnico."""
    solic = await create_test_user("111111112", "Solicitante", "solic2@unb.br", role=UserRole.SOLICITANTE)
    
    response = await client.patch(f"/api/v1/technicians/{solic.id}/reject", headers=gerente_headers)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "O usuário informado não é um técnico."
