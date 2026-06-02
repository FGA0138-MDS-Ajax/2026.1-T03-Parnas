import pytest
from httpx import AsyncClient
from fastapi import status

from app.models.ticket import Ticket, TicketStatus
from app.models.user import User, UserRole

@pytest.mark.asyncio
async def test_create_ticket_router_success(
    client: AsyncClient,
    test_solicitante: User,
    solicitante_headers: dict[str, str]
):
    """Garante que a criação de chamado via rota HTTP por um solicitante funciona e salva os dados corretos."""
    response = await client.post(
        "/api/v1/tickets",
        json={
            "local": "Sala de Aula Darcy Ribeiro - Prédio do SG",
            "tipo_manutencao=": "Instalações Elétricas",  # note: o schema tem esses campos
            "tipo_manutencao": "Instalações Elétricas",
            "descricao": "Luzes piscando na sala de aula."
        },
        headers=solicitante_headers
    )
    
    assert response.status_code == status.HTTP_201_CREATED
    json_data = response.json()
    assert json_data["id"] is not None
    assert json_data["local"] == "Sala de Aula Darcy Ribeiro - Prédio do SG"
    assert json_data["solicitante_id"] == test_solicitante.matricula
    assert json_data["status"] == TicketStatus.ABERTO.value

@pytest.mark.asyncio
async def test_create_ticket_router_forbidden(
    client: AsyncClient,
    test_tecnico: User,
    tecnico_headers: dict[str, str]
):
    """Garante que perfis não autorizados (ex: técnico) não consigam criar chamados (HTTP 403)."""
    response = await client.post(
        "/api/v1/tickets",
        json={
            "local": "Sala A1",
            "tipo_manutencao": "Hidráulica",
            "descricao": "Vazamento"
        },
        headers=tecnico_headers
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.asyncio
async def test_get_my_tickets_router(
    client: AsyncClient,
    test_solicitante: User,
    solicitante_headers: dict[str, str],
    create_test_ticket
):
    """Garante que o solicitante consiga obter apenas os seus chamados."""
    await create_test_ticket("Sala 1", "Eletricidade", "Sem luz", test_solicitante.matricula)

    response = await client.get("/api/v1/tickets/me", headers=solicitante_headers)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 1

@pytest.mark.asyncio
async def test_get_open_tickets_router(
    client: AsyncClient,
    test_solicitante: User,
    test_gerente: User,
    gerente_headers: dict[str, str],
    solicitante_headers: dict[str, str],
    create_test_ticket
):
    """Garante que a listagem de chamados abertos funcione para gerentes e retorne Forbidden para solicitantes."""
    await create_test_ticket("Sala 1", "Ar", "Quebrado", test_solicitante.matricula, status=TicketStatus.ABERTO)
    
    # 1. Acesso do Gerente (Permitido)
    res_gerente = await client.get("/api/v1/tickets/open", headers=gerente_headers)
    assert res_gerente.status_code == status.HTTP_200_OK
    assert len(res_gerente.json()) == 1

    # 2. Acesso do Solicitante (Negado)
    res_solic = await client.get("/api/v1/tickets/open", headers=solicitante_headers)
    assert res_solic.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.asyncio
async def test_get_assigned_tickets_router(
    client: AsyncClient,
    test_solicitante: User,
    test_tecnico: User,
    tecnico_headers: dict[str, str],
    solicitante_headers: dict[str, str],
    create_test_ticket
):
    """Garante que técnicos possam ver chamados a eles atribuídos e solicitantes tenham acesso negado."""
    await create_test_ticket(
        "Sala 1", "Luz", "Queimada", test_solicitante.matricula,
        tecnico_id=test_tecnico.matricula, status=TicketStatus.ATRIBUIDO
    )

    # 1. Técnico (Permitido)
    res_tec = await client.get("/api/v1/tickets/assigned-to-me", headers=tecnico_headers)
    assert res_tec.status_code == status.HTTP_200_OK
    assert len(res_tec.json()) == 1

    # 2. Solicitante (Negado)
    res_solic = await client.get("/api/v1/tickets/assigned-to-me", headers=solicitante_headers)
    assert res_solic.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.asyncio
async def test_assign_ticket_router(
    client: AsyncClient,
    test_solicitante: User,
    test_tecnico: User,
    test_gerente: User,
    gerente_headers: dict[str, str],
    create_test_ticket
):
    """Garante que a atribuição de chamado funcione quando requisitada por gerente."""
    ticket = await create_test_ticket("Sala 1", "Ar", "Quebrado", test_solicitante.matricula, status=TicketStatus.ABERTO)

    # Armazena matrículas e ID antes do expire_all nos bastidores
    tecnico_matricula = test_tecnico.matricula
    ticket_id = ticket.id

    response = await client.patch(
        f"/api/v1/tickets/{ticket_id}/assign",
        json={"tecnico_id": tecnico_matricula},
        headers=gerente_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    json_data = response.json()
    assert json_data["tecnico_id"] == tecnico_matricula
    assert json_data["status"] == TicketStatus.ATRIBUIDO.value

@pytest.mark.asyncio
async def test_update_ticket_status_router(
    client: AsyncClient,
    test_solicitante: User,
    test_tecnico: User,
    tecnico_headers: dict[str, str],
    create_test_ticket
):
    """Garante que a rota de alteração de status funcione para o técnico atribuído."""
    ticket = await create_test_ticket(
        "Sala 1", "Luz", "Queimada", test_solicitante.matricula,
        tecnico_id=test_tecnico.matricula, status=TicketStatus.ATRIBUIDO
    )

    ticket_id = ticket.id

    response = await client.patch(
        f"/api/v1/tickets/{ticket_id}/status",
        json={"status": "EM_ANDAMENTO"},
        headers=tecnico_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == TicketStatus.EM_ANDAMENTO.value
