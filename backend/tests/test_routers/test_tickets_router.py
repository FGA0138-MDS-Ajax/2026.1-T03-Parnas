import pytest
from httpx import AsyncClient
from fastapi import status

from app.routers import tickets as tickets_router
from app.models.ticket import Ticket, TicketStatus
from app.models.user import ApprovalStatus, User, UserRole
from app.core.security import create_access_token

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
    assert json_data["photo_path"] is None


@pytest.mark.asyncio
async def test_create_ticket_router_with_photo_path_success(
    client: AsyncClient,
    test_solicitante: User,
    solicitante_headers: dict[str, str]
):
    """Garante que a criação de chamado via rota HTTP por um solicitante funciona quando photo_path é enviado."""
    response = await client.post(
        "/api/v1/tickets",
        json={
            "local": "Sala de Aula Darcy Ribeiro - Prédio do SG",
            "tipo_manutencao": "Instalações Elétricas",
            "descricao": "Luzes piscando na sala de aula.",
            "photo_path": "uploads/images/luzes_sg.jpg"
        },
        headers=solicitante_headers
    )
    
    assert response.status_code == status.HTTP_201_CREATED
    json_data = response.json()
    assert json_data["id"] is not None
    assert json_data["local"] == "Sala de Aula Darcy Ribeiro - Prédio do SG"
    assert json_data["solicitante_id"] == test_solicitante.matricula
    assert json_data["status"] == TicketStatus.ABERTO.value
    assert json_data["photo_path"] == "uploads/images/luzes_sg.jpg"


@pytest.mark.asyncio
async def test_create_ticket_router_with_photo_upload_success(
    client: AsyncClient,
    test_solicitante: User,
    solicitante_headers: dict[str, str],
    tmp_path,
    monkeypatch,
):
    """Garante que solicitante consegue criar chamado enviando foto por multipart."""
    upload_dir = tmp_path / "uploads" / "tickets"
    monkeypatch.setattr(tickets_router, "TICKET_UPLOAD_DIR", upload_dir)

    response = await client.post(
        "/api/v1/tickets",
        data={
            "local": "Sala A1",
            "tipo_manutencao": "Elétrica",
            "descricao": "Tomada com mau contato.",
        },
        files={"photo": ("tomada.png", b"fake-png-content", "image/png")},
        headers=solicitante_headers,
    )

    assert response.status_code == status.HTTP_201_CREATED
    json_data = response.json()
    assert json_data["solicitante_id"] == test_solicitante.matricula
    assert json_data["photo_path"].startswith("/uploads/tickets/")
    assert json_data["photo_path"].endswith(".png")
    saved_filename = json_data["photo_path"].split("/")[-1]
    assert (upload_dir / saved_filename).read_bytes() == b"fake-png-content"


@pytest.mark.asyncio
async def test_create_ticket_router_rejects_invalid_photo_extension(
    client: AsyncClient,
    solicitante_headers: dict[str, str],
    tmp_path,
    monkeypatch,
):
    """Garante que backend aceita apenas extensões seguras para foto."""
    monkeypatch.setattr(tickets_router, "TICKET_UPLOAD_DIR", tmp_path / "uploads" / "tickets")

    response = await client.post(
        "/api/v1/tickets",
        data={
            "local": "Sala A1",
            "tipo_manutencao": "Elétrica",
            "descricao": "Tomada com mau contato.",
        },
        files={"photo": ("tomada.gif", b"fake-gif-content", "image/gif")},
        headers=solicitante_headers,
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "Formato de foto inválido. Envie apenas arquivos .jpg, .jpeg ou .png."


@pytest.mark.asyncio
async def test_create_ticket_router_rejects_photo_larger_than_10mb(
    client: AsyncClient,
    solicitante_headers: dict[str, str],
    tmp_path,
    monkeypatch,
):
    """Garante que backend limita foto a no máximo 10MB."""
    monkeypatch.setattr(tickets_router, "TICKET_UPLOAD_DIR", tmp_path / "uploads" / "tickets")

    response = await client.post(
        "/api/v1/tickets",
        data={
            "local": "Sala A1",
            "tipo_manutencao": "Elétrica",
            "descricao": "Tomada com mau contato.",
        },
        files={"photo": ("tomada.jpg", b"x" * (10 * 1024 * 1024 + 1), "image/jpeg")},
        headers=solicitante_headers,
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "A foto deve ter no máximo 10MB."


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
    assert response.json()["detail"] == "Sem permissão para realizar esta operação."
    assert response.json()["status_code"] == status.HTTP_403_FORBIDDEN

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
async def test_get_all_tickets_router_requires_gerente(
    client: AsyncClient,
    test_solicitante: User,
    test_gerente: User,
    gerente_headers: dict[str, str],
    solicitante_headers: dict[str, str],
    create_test_ticket
):
    """Garante que apenas gerente liste todos os chamados."""
    await create_test_ticket("Sala 1", "Ar", "Quebrado", test_solicitante.matricula, status=TicketStatus.ABERTO)
    await create_test_ticket("Sala 2", "Luz", "Sem luz", test_solicitante.matricula, status=TicketStatus.EM_ANDAMENTO)

    res_unauthenticated = await client.get("/api/v1/tickets")
    assert res_unauthenticated.status_code == status.HTTP_401_UNAUTHORIZED

    res_solic = await client.get("/api/v1/tickets", headers=solicitante_headers)
    assert res_solic.status_code == status.HTTP_403_FORBIDDEN

    res_gerente = await client.get("/api/v1/tickets", headers=gerente_headers)
    assert res_gerente.status_code == status.HTTP_200_OK
    assert len(res_gerente.json()) == 2

@pytest.mark.asyncio
async def test_get_in_progress_tickets_router_requires_gerente(
    client: AsyncClient,
    test_solicitante: User,
    test_gerente: User,
    gerente_headers: dict[str, str],
    solicitante_headers: dict[str, str],
    create_test_ticket
):
    """Garante que apenas gerente liste chamados atribuidos ou em andamento."""
    await create_test_ticket("Sala 1", "Ar", "Quebrado", test_solicitante.matricula, status=TicketStatus.ATRIBUIDO)
    await create_test_ticket("Sala 2", "Luz", "Sem luz", test_solicitante.matricula, status=TicketStatus.EM_ANDAMENTO)
    await create_test_ticket("Sala 3", "Hidraulica", "Vazamento", test_solicitante.matricula, status=TicketStatus.ABERTO)

    res_solic = await client.get("/api/v1/tickets/in-progress", headers=solicitante_headers)
    assert res_solic.status_code == status.HTTP_403_FORBIDDEN

    res_gerente = await client.get("/api/v1/tickets/in-progress", headers=gerente_headers)
    assert res_gerente.status_code == status.HTTP_200_OK
    assert len(res_gerente.json()) == 2

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
async def test_suggest_technician_router_returns_least_loaded_matching_technician(
    client: AsyncClient,
    test_solicitante: User,
    gerente_headers: dict[str, str],
    create_test_user,
    create_test_ticket
):
    """Garante sugestão de técnico ativo, aprovado, compatível e com menor carga."""
    busy_technician = await create_test_user(
        "444444444",
        "Tecnico Ocupado",
        "tecnico_ocupado@teste.com",
        role=UserRole.TECNICO,
        area_manutencao="Elétrica",
    )
    suggested_technician = await create_test_user(
        "555555555",
        "Tecnico Livre",
        "tecnico_livre@teste.com",
        role=UserRole.TECNICO,
        area_manutencao="Elétrica",
    )
    await create_test_user(
        "666666666",
        "Tecnico Hidraulica",
        "tecnico_hidraulica@teste.com",
        role=UserRole.TECNICO,
        area_manutencao="Hidráulica",
    )
    await create_test_user(
        "777777777",
        "Solicitante Elétrica",
        "solicitante_eletrica@teste.com",
        role=UserRole.SOLICITANTE,
        area_manutencao="Elétrica",
    )
    await create_test_user(
        "888888888",
        "Tecnico Pendente",
        "tecnico_pendente@teste.com",
        role=UserRole.TECNICO,
        approval_status=ApprovalStatus.PENDENTE,
        area_manutencao="Elétrica",
    )
    await create_test_user(
        "999999999",
        "Tecnico Inativo",
        "tecnico_inativo@teste.com",
        role=UserRole.TECNICO,
        ativo=False,
        area_manutencao="Elétrica",
    )
    ticket = await create_test_ticket(
        "Sala 1",
        "Elétrica",
        "Tomada com mau contato",
        test_solicitante.matricula,
    )
    await create_test_ticket(
        "Sala 2",
        "Elétrica",
        "Lâmpada queimada",
        test_solicitante.matricula,
        tecnico_id=busy_technician.matricula,
        status=TicketStatus.ATRIBUIDO,
    )

    response = await client.get(
        f"/api/v1/tickets/{ticket.id}/suggest-technician",
        headers=gerente_headers,
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "nome": suggested_technician.nome,
        "area_manutencao": "Elétrica",
        "quantidade_chamados_ativos": 0,
    }


@pytest.mark.asyncio
async def test_suggest_technician_router_requires_manager(
    client: AsyncClient,
    test_solicitante: User,
    solicitante_headers: dict[str, str],
    create_test_ticket
):
    """Garante que apenas gerente possa solicitar sugestão de técnico."""
    ticket = await create_test_ticket(
        "Sala 1",
        "Elétrica",
        "Tomada com mau contato",
        test_solicitante.matricula,
    )

    response = await client.get(
        f"/api/v1/tickets/{ticket.id}/suggest-technician",
        headers=solicitante_headers,
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN

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
    ticket = await create_test_ticket("Sala 1", "Elétrica", "Quebrado", test_solicitante.matricula, status=TicketStatus.ABERTO)

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

@pytest.mark.asyncio
async def test_update_ticket_status_router_forbidden_for_other_technician(
    client: AsyncClient,
    test_solicitante: User,
    test_tecnico: User,
    create_test_user,
    create_test_ticket
):
    """Garante que tecnico nao atualize chamado atribuido a outro tecnico."""
    ticket = await create_test_ticket(
        "Sala 1", "Luz", "Queimada", test_solicitante.matricula,
        tecnico_id=test_tecnico.matricula, status=TicketStatus.ATRIBUIDO
    )
    outro_tecnico = await create_test_user(
        "999999999",
        "Outro Tecnico",
        "outro_tecnico@teste.com",
        role=UserRole.TECNICO,
        ativo=True,
    )

    response = await client.patch(
        f"/api/v1/tickets/{ticket.id}/status",
        json={"status": "EM_ANDAMENTO"},
        headers={"Authorization": f"Bearer {create_access_token(subject=outro_tecnico.matricula)}"},
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()["path"] == f"/api/v1/tickets/{ticket.id}/status"


@pytest.mark.asyncio
async def test_create_ticket_validation_error_returns_standard_payload(
    client: AsyncClient,
    solicitante_headers: dict[str, str],
):
    """Garante que falhas de campos obrigatórios retornem 400 com lista legível."""
    response = await client.post(
        "/api/v1/tickets",
        json={
            "tipo_manutencao": "Elétrica",
            "descricao": "Lâmpada queimada",
        },
        headers=solicitante_headers,
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    json_data = response.json()
    assert json_data["detail"] == "Falha na validação dos dados enviados."
    assert json_data["status_code"] == status.HTTP_400_BAD_REQUEST
    assert json_data["path"] == "/api/v1/tickets"
    assert {
        "field": "body.local",
        "message": "Campo obrigatório.",
        "type": "missing",
    } in json_data["errors"]


@pytest.mark.asyncio
async def test_assign_ticket_not_found_returns_standard_payload(
    client: AsyncClient,
    test_tecnico: User,
    gerente_headers: dict[str, str],
):
    """Garante que chamado inexistente retorne 404 no padrão de erro da API."""
    response = await client.patch(
        "/api/v1/tickets/999999/assign",
        json={"tecnico_id": test_tecnico.matricula},
        headers=gerente_headers,
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    json_data = response.json()
    assert json_data["detail"] == "Chamado não encontrado"
    assert json_data["status_code"] == status.HTTP_404_NOT_FOUND
    assert json_data["path"] == "/api/v1/tickets/999999/assign"
