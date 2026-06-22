import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ticket import Ticket, TicketStatus
from app.models.user import User, UserRole
from app.repositories.ticket_repository import TicketRepository
from app.schemas.ticket import TicketCreate

@pytest.mark.asyncio
async def test_create_ticket_success(db_session: AsyncSession, test_solicitante: User):
    """Garante que um ticket pode ser criado com valores corretos e comportamento padrão."""
    ticket_in = TicketCreate(
        local="Prédio da Computação - Sala A1",
        tipo_manutencao="Ar condicionado",
        descricao="Ar condicionado não está refrigerando a sala."
    )

    ticket = await TicketRepository.create(
        db=db_session,
        ticket_in=ticket_in,
        solicitante_id=test_solicitante.matricula
    )

    assert ticket.id is not None
    assert ticket.local == "Prédio da Computação - Sala A1"
    assert ticket.tipo_manutencao == "Ar condicionado"
    assert ticket.descricao == "Ar condicionado não está refrigerando a sala."
    assert ticket.status == TicketStatus.ABERTO
    assert ticket.solicitante_id == test_solicitante.matricula
    assert ticket.tecnico_id is None
    assert not ticket.photo_paths


@pytest.mark.asyncio
async def test_create_ticket_with_photo_paths_success(db_session: AsyncSession, test_solicitante: User):
    """Garante que um ticket pode ser criado com photo_paths preenchido."""
    ticket_in = TicketCreate(
        local="Prédio da Computação - Sala A1",
        tipo_manutencao="Ar condicionado",
        descricao="Ar condicionado não está refrigerando a sala.",
        photo_paths=["uploads/images/ar_condicionado.png"]
    )

    ticket = await TicketRepository.create(
        db=db_session,
        ticket_in=ticket_in,
        solicitante_id=test_solicitante.matricula
    )

    assert ticket.id is not None
    assert ticket.photo_paths == ["uploads/images/ar_condicionado.png"]


@pytest.mark.asyncio
async def test_get_by_solicitante_id(
    db_session: AsyncSession,
    test_solicitante: User,
    create_test_user,
    create_test_ticket
):
    """Garante que a busca de chamados por solicitante retorna apenas os registros dele."""
    # Cria outro solicitante
    outro_solicitante = await create_test_user(
        matricula="999999999",
        nome="Outro Solicitante",
        email="outro@teste.com",
        role=UserRole.SOLICITANTE
    )

    # Cria chamados para o solicitante padrão
    t1 = await create_test_ticket("Sala 1", "Eletricidade", "Sem luz", test_solicitante.matricula)
    t2 = await create_test_ticket("Sala 2", "Limpeza", "Chão sujo", test_solicitante.matricula)

    # Cria chamado para outro solicitante
    await create_test_ticket("Sala 3", "Internet", "Sem conexão", outro_solicitante.matricula)

    tickets = await TicketRepository.get_by_solicitante_id(db_session, test_solicitante.matricula)

    assert len(tickets) == 2
    ticket_ids = [t.id for t in tickets]
    assert t1.id in ticket_ids
    assert t2.id in ticket_ids

@pytest.mark.asyncio
async def test_get_by_status(
    db_session: AsyncSession,
    test_solicitante: User,
    create_test_ticket
):
    """Garante que a listagem por status retorna apenas os chamados no status filtrado."""
    t_aberto = await create_test_ticket(
        "Sala 1", "Luz", "Sem luz", test_solicitante.matricula, status=TicketStatus.ABERTO
    )
    await create_test_ticket(
        "Sala 2", "Luz", "Sem luz", test_solicitante.matricula, status=TicketStatus.ATRIBUIDO
    )

    tickets_abertos = await TicketRepository.get_by_status(db_session, TicketStatus.ABERTO)

    assert len(tickets_abertos) == 1
    assert tickets_abertos[0].id == t_aberto.id

@pytest.mark.asyncio
async def test_get_by_id(
    db_session: AsyncSession,
    test_solicitante: User,
    create_test_ticket
):
    """Garante que a busca por ID localiza corretamente o chamado correspondente."""
    ticket = await create_test_ticket("Sala 1", "Ar", "Quebrado", test_solicitante.matricula)

    # Busca chamado existente
    found = await TicketRepository.get_by_id(db_session, ticket.id)
    assert found is not None
    assert found.id == ticket.id
    assert found.local == "Sala 1"

    # Busca ID inexistente
    not_found = await TicketRepository.get_by_id(db_session, 9999)
    assert not_found is None

@pytest.mark.asyncio
async def test_get_by_tecnico_id(
    db_session: AsyncSession,
    test_solicitante: User,
    test_tecnico: User,
    create_test_user,
    create_test_ticket
):
    """Garante que a busca por técnico retorna apenas chamados atribuídos a ele."""
    # Cria outro técnico
    outro_tec = await create_test_user(
        matricula="999999999",
        nome="Outro Técnico",
        email="outrotec@teste.com",
        role=UserRole.TECNICO
    )

    # Chamado do técnico padrão
    t1 = await create_test_ticket(
        "Sala 1", "Ar", "Quebrado", test_solicitante.matricula,
        tecnico_id=test_tecnico.matricula, status=TicketStatus.ATRIBUIDO
    )
    # Chamado de outro técnico
    await create_test_ticket(
        "Sala 2", "Ar", "Quebrado", test_solicitante.matricula,
        tecnico_id=outro_tec.matricula, status=TicketStatus.ATRIBUIDO
    )

    tickets = await TicketRepository.get_by_tecnico_id(db_session, test_tecnico.matricula)

    assert len(tickets) == 1
    assert tickets[0].id == t1.id

@pytest.mark.asyncio
async def test_update_ticket(
    db_session: AsyncSession,
    test_solicitante: User,
    test_tecnico: User,
    create_test_ticket
):
    """Garante que as atualizações do chamado são persistidas com sucesso."""
    ticket = await create_test_ticket("Sala 1", "Ar", "Quebrado", test_solicitante.matricula)
    
    # Atualiza técnico e status
    ticket.tecnico_id = test_tecnico.matricula
    ticket.status = TicketStatus.ATRIBUIDO

    updated = await TicketRepository.update(db_session, ticket)

    assert updated.tecnico_id == test_tecnico.matricula
    assert updated.status == TicketStatus.ATRIBUIDO

    # Confere persistência no banco
    tecnico_matricula = test_tecnico.matricula
    ticket_id = ticket.id
    db_session.expire_all()
    in_db = await TicketRepository.get_by_id(db_session, ticket_id)
    assert in_db.status == TicketStatus.ATRIBUIDO
    assert in_db.tecnico_id == tecnico_matricula


@pytest.mark.asyncio
async def test_count_active_tickets_by_technician(
    db_session: AsyncSession,
    test_solicitante: User,
    test_tecnico: User,
    create_test_ticket
):
    """Garante que a contagem de chamados ativos por técnico considera apenas status corretos."""
    # Chamado em status ABERTO sem técnico
    await create_test_ticket("Sala 1", "Ar", "Quebrado", test_solicitante.matricula, status=TicketStatus.ABERTO)
    
    # Chamado atribuído (ativo)
    await create_test_ticket("Sala 2", "Ar", "Quebrado", test_solicitante.matricula, tecnico_id=test_tecnico.matricula, status=TicketStatus.ATRIBUIDO)
    
    # Chamado em andamento (ativo)
    await create_test_ticket("Sala 3", "Ar", "Quebrado", test_solicitante.matricula, tecnico_id=test_tecnico.matricula, status=TicketStatus.EM_ANDAMENTO)
    
    # Chamado concluído (inativo)
    await create_test_ticket("Sala 4", "Ar", "Quebrado", test_solicitante.matricula, tecnico_id=test_tecnico.matricula, status=TicketStatus.CONCLUIDO)
    
    # Chamado cancelado (inativo)
    await create_test_ticket("Sala 5", "Ar", "Quebrado", test_solicitante.matricula, tecnico_id=test_tecnico.matricula, status=TicketStatus.CANCELADO)

    count = await TicketRepository.count_active_tickets_by_technician(db_session, test_tecnico.matricula)
    assert count == 2


