import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole, ApprovalStatus
from app.models.ticket import Ticket, TicketStatus
from app.models.comment import Comment
from app.models.ticket_history import TicketHistory
from app.core.security import get_password_hash, create_access_token


@pytest.fixture
async def test_admin(create_test_user) -> User:
    return await create_test_user(
        matricula="444444444",
        nome="Admin Teste",
        email="admin@teste.com",
        role=UserRole.ADMIN,
        admin_pin_hash=get_password_hash("1234")
    )


@pytest.fixture
def admin_headers(test_admin: User) -> dict[str, str]:
    # Token normal sem a claim de PIN verificado
    token = create_access_token(subject=test_admin.matricula)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_pin_headers(test_admin: User) -> dict[str, str]:
    # Token contendo a claim pin_verified=True
    token = create_access_token(
        subject=test_admin.matricula,
        additional_claims={"pin_verified": True}
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_verify_pin_success(client: AsyncClient, test_admin: User, admin_headers: dict[str, str]):
    response = await client.post(
        "/api/v1/admin/verify-pin",
        json={"pin": "1234"},
        headers=admin_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_verify_pin_wrong_pin(client: AsyncClient, test_admin: User, admin_headers: dict[str, str]):
    response = await client.post(
        "/api/v1/admin/verify-pin",
        json={"pin": "9999"},
        headers=admin_headers
    )
    assert response.status_code == 400
    assert "PIN incorreto" in response.json()["detail"]


@pytest.mark.asyncio
async def test_verify_pin_not_admin(client: AsyncClient, solicitante_headers: dict[str, str]):
    response = await client.post(
        "/api/v1/admin/verify-pin",
        json={"pin": "1234"},
        headers=solicitante_headers
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_change_pin_success(
    client: AsyncClient,
    test_admin: User,
    admin_pin_headers: dict[str, str],
    db_session: AsyncSession
):
    response = await client.post(
        "/api/v1/admin/change-pin",
        json={"current_pin": "1234", "new_pin": "5678"},
        headers=admin_pin_headers
    )
    assert response.status_code == 200
    assert response.json()["message"] == "PIN alterado com sucesso."

    # Validar se o hash mudou no banco
    await db_session.refresh(test_admin)
    from app.core.security import verify_password
    assert verify_password("5678", test_admin.admin_pin_hash)


@pytest.mark.asyncio
async def test_change_pin_wrong_current(client: AsyncClient, admin_pin_headers: dict[str, str]):
    response = await client.post(
        "/api/v1/admin/change-pin",
        json={"current_pin": "9999", "new_pin": "5678"},
        headers=admin_pin_headers
    )
    assert response.status_code == 400
    assert "PIN atual incorreto" in response.json()["detail"]


@pytest.mark.asyncio
async def test_list_users_success(
    client: AsyncClient,
    test_solicitante: User,
    admin_pin_headers: dict[str, str]
):
    response = await client.get("/api/v1/admin/users", headers=admin_pin_headers)
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 2
    # Procurar o solicitante na listagem
    emails = [u["email"] for u in users]
    assert test_solicitante.email in emails


@pytest.mark.asyncio
async def test_list_users_no_pin(client: AsyncClient, admin_headers: dict[str, str]):
    response = await client.get("/api/v1/admin/users", headers=admin_headers)
    assert response.status_code == 403
    assert "PIN administrativo não verificado" in response.json()["detail"]


@pytest.mark.asyncio
async def test_create_manager_success(client: AsyncClient, admin_pin_headers: dict[str, str], db_session: AsyncSession):
    manager_data = {
        "nome": "Novo Gerente",
        "email": "novo_gerente@teste.com",
        "senha": "senha_segura_123",
        "matricula": "555555555"
    }
    response = await client.post(
        "/api/v1/admin/managers",
        json=manager_data,
        headers=admin_pin_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == manager_data["email"]
    assert data["role"] == UserRole.GERENTE.value
    assert data["approval_status"] == ApprovalStatus.APROVADO.value
    assert data["ativo"] is True

    # Validar no banco
    res = await db_session.execute(select(User).where(User.email == manager_data["email"]))
    db_user = res.scalars().first()
    assert db_user is not None
    assert db_user.matricula == "555555555"


@pytest.mark.asyncio
async def test_create_manager_auto_matricula(client: AsyncClient, admin_pin_headers: dict[str, str], db_session: AsyncSession):
    manager_data = {
        "nome": "Gerente Auto Matricula",
        "email": "auto_gerente@teste.com",
        "senha": "senha_segura_123"
    }
    response = await client.post(
        "/api/v1/admin/managers",
        json=manager_data,
        headers=admin_pin_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["matricula"].startswith("3")
    assert len(data["matricula"]) == 9


@pytest.mark.asyncio
async def test_update_user_success(
    client: AsyncClient,
    test_solicitante: User,
    admin_pin_headers: dict[str, str],
    db_session: AsyncSession
):
    response = await client.patch(
        f"/api/v1/admin/users/{test_solicitante.id}",
        json={"nome": "Nome Atualizado pelo Admin", "area_manutencao": "Administrativa"},
        headers=admin_pin_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nome"] == "Nome Atualizado pelo Admin"
    assert data["area_manutencao"] == "Administrativa"

    await db_session.refresh(test_solicitante)
    assert test_solicitante.nome == "Nome Atualizado pelo Admin"


@pytest.mark.asyncio
async def test_deactivate_user_success(
    client: AsyncClient,
    test_solicitante: User,
    admin_pin_headers: dict[str, str],
    db_session: AsyncSession
):
    response = await client.patch(
        f"/api/v1/admin/users/{test_solicitante.id}/deactivate",
        headers=admin_pin_headers
    )
    assert response.status_code == 200
    assert response.json()["ativo"] is False

    await db_session.refresh(test_solicitante)
    assert test_solicitante.ativo is False


@pytest.mark.asyncio
async def test_delete_user_success_no_tickets(
    client: AsyncClient,
    test_solicitante: User,
    admin_pin_headers: dict[str, str],
    db_session: AsyncSession
):
    response = await client.delete(
        f"/api/v1/admin/users/{test_solicitante.id}",
        headers=admin_pin_headers
    )
    assert response.status_code == 204

    # Confirmar exclusão física do solicitante
    res = await db_session.execute(select(User).where(User.matricula == test_solicitante.matricula))
    assert res.scalars().first() is None


@pytest.mark.asyncio
async def test_delete_technician_cascade_null(
    client: AsyncClient,
    test_tecnico: User,
    test_solicitante: User,
    create_test_ticket,
    admin_pin_headers: dict[str, str],
    db_session: AsyncSession
):
    # Criar chamado associado ao técnico
    ticket = await create_test_ticket(
        local="UAC",
        tipo_manutencao="Estrutural",
        descricao="Descricao do chamado",
        solicitante_id=test_solicitante.matricula,
        tecnico_id=test_tecnico.matricula,
        status=TicketStatus.ATRIBUIDO
    )

    # Deletar o técnico
    response = await client.delete(
        f"/api/v1/admin/users/{test_tecnico.id}",
        headers=admin_pin_headers
    )
    assert response.status_code == 204

    # Confirmar exclusão do técnico
    res_user = await db_session.execute(select(User).where(User.matricula == test_tecnico.matricula))
    assert res_user.scalars().first() is None

    # Confirmar se o chamado teve seu tecnico_id atualizado para NULL
    res_ticket = await db_session.execute(select(Ticket).where(Ticket.id == ticket.id))
    db_ticket = res_ticket.scalars().first()
    assert db_ticket is not None
    await db_session.refresh(db_ticket)
    assert db_ticket.tecnico_id is None


@pytest.mark.asyncio
async def test_delete_solicitante_sentinela_migration(
    client: AsyncClient,
    test_solicitante: User,
    test_tecnico: User,
    create_test_ticket,
    admin_pin_headers: dict[str, str],
    db_session: AsyncSession
):
    # Criar ticket
    ticket = await create_test_ticket(
        local="UED",
        tipo_manutencao="Elétrica",
        descricao="Descricao do teste",
        solicitante_id=test_solicitante.matricula
    )

    # Criar comentário
    comment = Comment(
        user_id=test_solicitante.matricula,
        ticket_id=ticket.id,
        mensagem="Comentário do solicitante"
    )
    db_session.add(comment)

    # Criar histórico
    history = TicketHistory(
        ticket_id=ticket.id,
        user_id=test_solicitante.matricula,
        action="Solicitante realizou ação",
        new_status=TicketStatus.ABERTO
    )
    db_session.add(history)
    await db_session.commit()

    # Deletar o solicitante físico
    response = await client.delete(
        f"/api/v1/admin/users/{test_solicitante.id}",
        headers=admin_pin_headers
    )
    assert response.status_code == 204

    # Validar se o solicitante físico sumiu
    res_user = await db_session.execute(select(User).where(User.matricula == test_solicitante.matricula))
    assert res_user.scalars().first() is None

    # Validar se o usuário sentinela foi criado
    res_sentinela = await db_session.execute(select(User).where(User.matricula == "000000000"))
    sentinela = res_sentinela.scalars().first()
    assert sentinela is not None
    assert sentinela.nome == "Usuário Excluído"

    # Validar reatribuições
    await db_session.refresh(ticket)
    assert ticket.solicitante_id == "000000000"

    res_comment = await db_session.execute(select(Comment).where(Comment.id == comment.id))
    db_comment = res_comment.scalars().first()
    assert db_comment.user_id == "000000000"

    res_history = await db_session.execute(select(TicketHistory).where(TicketHistory.id == history.id))
    db_history = res_history.scalars().first()
    assert db_history.user_id == "000000000"


@pytest.mark.asyncio
async def test_delete_sentinela_fails(
    client: AsyncClient,
    admin_pin_headers: dict[str, str],
    db_session: AsyncSession
):
    # Garantir criação do sentinela
    sentinela = User(
        matricula="000000000",
        nome="Usuário Excluído",
        email="excluido@unb.br",
        senha_hash=get_password_hash("random_unusable_pass"),
        role=UserRole.SOLICITANTE,
        ativo=False,
        approval_status=ApprovalStatus.APROVADO,
    )
    db_session.add(sentinela)
    await db_session.commit()
    await db_session.refresh(sentinela)

    # Tentar excluir
    response = await client.delete(
        f"/api/v1/admin/users/{sentinela.id}",
        headers=admin_pin_headers
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Não é possível excluir o usuário sentinela."
