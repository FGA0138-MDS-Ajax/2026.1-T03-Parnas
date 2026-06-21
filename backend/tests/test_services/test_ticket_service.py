import pytest
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ticket import Ticket, TicketStatus
from app.models.user import User, UserRole
from app.services.ticket_service import TicketService
from app.schemas.ticket import TicketCreate

@pytest.mark.asyncio
async def test_create_ticket_service(db_session: AsyncSession, test_solicitante: User):
    """Garante que a criação de chamado via serviço salva os dados corretamente."""
    ticket_in = TicketCreate(
        local="Sala A1",
        tipo_manutencao="Filtro de Ar",
        descricao="Substituição necessária"
    )

    ticket = await TicketService.create_ticket(db_session, ticket_in, test_solicitante)
    
    assert ticket.id is not None
    assert ticket.local == "Sala A1"
    assert ticket.solicitante_id == test_solicitante.matricula
    assert ticket.status == TicketStatus.ABERTO

@pytest.mark.asyncio
async def test_get_user_tickets_service(db_session: AsyncSession, test_solicitante: User, create_test_ticket):
    """Garante que a listagem de chamados do usuário via serviço retorne apenas os dele."""
    t1 = await create_test_ticket("Sala 1", "Ar", "Quebrado", test_solicitante.matricula)
    
    tickets = await TicketService.get_user_tickets(db_session, test_solicitante)
    assert len(tickets) == 1
    assert tickets[0].id == t1.id

@pytest.mark.asyncio
async def test_get_open_tickets_service(db_session: AsyncSession, test_solicitante: User, create_test_ticket):
    """Garante que a listagem de chamados abertos via serviço retorne apenas os abertos."""
    t_aberto = await create_test_ticket("Sala 1", "Luz", "Sem luz", test_solicitante.matricula, status=TicketStatus.ABERTO)
    await create_test_ticket("Sala 2", "Luz", "Sem luz", test_solicitante.matricula, status=TicketStatus.ATRIBUIDO)

    tickets = await TicketService.get_open_tickets(db_session)
    assert len(tickets) == 1
    assert tickets[0].id == t_aberto.id

@pytest.mark.asyncio
async def test_get_all_tickets_service(db_session: AsyncSession, test_solicitante: User, create_test_ticket):
    """Garante que a listagem geral retorna todos os chamados para uso do gerente."""
    await create_test_ticket("Sala 1", "Luz", "Sem luz", test_solicitante.matricula, status=TicketStatus.ABERTO)
    await create_test_ticket("Sala 2", "Ar", "Quebrado", test_solicitante.matricula, status=TicketStatus.EM_ANDAMENTO)

    tickets = await TicketService.get_all_tickets(db_session)
    assert len(tickets) == 2

@pytest.mark.asyncio
async def test_get_in_progress_tickets_service(db_session: AsyncSession, test_solicitante: User, create_test_ticket):
    """Garante que gerente acompanhe chamados atribuidos e em andamento."""
    t_atribuido = await create_test_ticket("Sala 1", "Luz", "Sem luz", test_solicitante.matricula, status=TicketStatus.ATRIBUIDO)
    t_em_andamento = await create_test_ticket("Sala 2", "Ar", "Quebrado", test_solicitante.matricula, status=TicketStatus.EM_ANDAMENTO)
    await create_test_ticket("Sala 3", "Hidraulica", "Vazamento", test_solicitante.matricula, status=TicketStatus.ABERTO)

    tickets = await TicketService.get_in_progress_tickets(db_session)
    ticket_ids = {ticket.id for ticket in tickets}
    assert ticket_ids == {t_atribuido.id, t_em_andamento.id}

@pytest.mark.asyncio
async def test_assign_technician_success(db_session: AsyncSession, test_solicitante: User, test_tecnico: User, create_test_ticket):
    """Garante que atribuir um técnico ativo a um chamado aberto funciona com sucesso."""
    ticket = await create_test_ticket("Sala 1", "Elétrica", "Tomada", test_solicitante.matricula, status=TicketStatus.ABERTO)

    tecnico_matricula = test_tecnico.matricula
    ticket_id = ticket.id
    
    updated = await TicketService.assign_technician(db_session, ticket_id, tecnico_matricula, test_solicitante.matricula)
    
    assert updated.tecnico_id == tecnico_matricula
    assert updated.status == TicketStatus.ATRIBUIDO

@pytest.mark.asyncio
async def test_assign_technician_ticket_not_found(db_session: AsyncSession, test_tecnico: User):
    """Garante que tentar atribuir técnico a um chamado inexistente falha com 404."""
    with pytest.raises(HTTPException) as exc_info:
        await TicketService.assign_technician(db_session, 9999, test_tecnico.matricula, "900000002")
        
    assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND
    assert exc_info.value.detail == "Chamado não encontrado"

@pytest.mark.asyncio
async def test_assign_technician_ticket_not_open(db_session: AsyncSession, test_solicitante: User, test_tecnico: User, create_test_ticket):
    """Garante que tentar atribuir técnico a um chamado que não está aberto falha com 400."""
    ticket = await create_test_ticket("Sala 1", "Ar", "Ruído", test_solicitante.matricula, status=TicketStatus.ATRIBUIDO)
    
    with pytest.raises(HTTPException) as exc_info:
        await TicketService.assign_technician(db_session, ticket.id, test_tecnico.matricula, "900000002")
        
    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert exc_info.value.detail == "O chamado precisa estar com o status ABERTO para receber uma atribuição"

@pytest.mark.asyncio
async def test_assign_technician_invalid_technician(db_session: AsyncSession, test_solicitante: User, create_test_user, create_test_ticket):
    """Garante que tentar atribuir um técnico inexistente, inativo ou com role diferente de TECNICO falha com as regras refinadas."""
    ticket = await create_test_ticket("Sala 1", "Ar", "Ruído", test_solicitante.matricula, status=TicketStatus.ABERTO)
    
    # 1. Técnico inativo
    tec_inativo = await create_test_user("777777777", "Técnico Inativo", "tec_inativo@teste.com", role=UserRole.TECNICO, ativo=False)
    with pytest.raises(HTTPException) as exc_info:
        await TicketService.assign_technician(db_session, ticket.id, tec_inativo.matricula, "900000002")
    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert exc_info.value.detail == "O técnico selecionado está inativo no sistema"

    # 2. Solicitante como técnico (role inválida)
    solicitante = await create_test_user("888888888", "Novo Solicitante", "solic2@teste.com", role=UserRole.SOLICITANTE, ativo=True)
    with pytest.raises(HTTPException) as exc_info:
        await TicketService.assign_technician(db_session, ticket.id, solicitante.matricula, "900000002")
    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert exc_info.value.detail == "O usuário selecionado não possui o perfil de TÉCNICO"

    # 3. Técnico inexistente (Valida o 404 da regra de negócio)
    with pytest.raises(HTTPException) as exc_info:
        await TicketService.assign_technician(db_session, ticket.id, "000000000", "900000002")
    assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND
    assert exc_info.value.detail == "O técnico informado não existe no sistema"

@pytest.mark.asyncio
async def test_assign_technician_rejects_incompatible_area(
    db_session: AsyncSession,
    test_solicitante: User,
    create_test_user,
    create_test_ticket,
):
    """Garante que gerente não atribua chamado a técnico de outra área."""
    ticket = await create_test_ticket("Sala 1", "Elétrica", "Tomada", test_solicitante.matricula, status=TicketStatus.ABERTO)
    tecnico_hidraulica = await create_test_user(
        "777777778",
        "Técnico Hidráulica",
        "tec_hidraulica@teste.com",
        role=UserRole.TECNICO,
        ativo=True,
        area_manutencao="Hidráulica",
    )

    with pytest.raises(HTTPException) as exc_info:
        await TicketService.assign_technician(
            db_session,
            ticket.id,
            tecnico_hidraulica.matricula,
            "900000002",
        )

    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert exc_info.value.detail == "A área do técnico não é compatível com o tipo de manutenção do chamado"


@pytest.mark.asyncio
async def test_get_tickets_by_technician_service(db_session: AsyncSession, test_solicitante: User, test_tecnico: User, create_test_ticket):
    """Garante que a busca de chamados por técnico via serviço retorna apenas os dele."""
    t1 = await create_test_ticket("Sala 1", "Ar", "Quebrado", test_solicitante.matricula, tecnico_id=test_tecnico.matricula, status=TicketStatus.ATRIBUIDO)

    tickets = await TicketService.get_tickets_by_technician(db_session, test_tecnico.matricula)
    assert len(tickets) == 1
    assert tickets[0].id == t1.id

@pytest.mark.asyncio
async def test_update_ticket_status_success(db_session: AsyncSession, test_solicitante: User, test_tecnico: User, create_test_ticket):
    """Garante que o técnico atribuído consegue alterar o status do chamado com sucesso."""
    ticket = await create_test_ticket("Sala 1", "Ar", "Quebrado", test_solicitante.matricula, tecnico_id=test_tecnico.matricula, status=TicketStatus.ATRIBUIDO)

    updated = await TicketService.update_ticket_status(db_session, ticket.id, TicketStatus.EM_ANDAMENTO, test_tecnico.matricula)
    assert updated.status == TicketStatus.EM_ANDAMENTO

@pytest.mark.asyncio
async def test_update_ticket_status_not_found(db_session: AsyncSession, test_tecnico: User):
    """Garante que tentar alterar o status de chamado inexistente falha com 404."""
    with pytest.raises(HTTPException) as exc_info:
        await TicketService.update_ticket_status(db_session, 9999, TicketStatus.EM_ANDAMENTO, test_tecnico.matricula)
    assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.asyncio
async def test_update_ticket_status_forbidden(db_session: AsyncSession, test_solicitante: User, test_tecnico: User, create_test_user, create_test_ticket):
    """Garante que tentar alterar status de um chamado atribuído a OUTRO técnico falha com 403."""
    ticket = await create_test_ticket("Sala 1", "Ar", "Quebrado", test_solicitante.matricula, tecnico_id=test_tecnico.matricula, status=TicketStatus.ATRIBUIDO)
    
    outro_tec = await create_test_user("999999999", "Outro Técnico", "outrotec@teste.com", role=UserRole.TECNICO, ativo=True)
    
    with pytest.raises(HTTPException) as exc_info:
        await TicketService.update_ticket_status(db_session, ticket.id, TicketStatus.EM_ANDAMENTO, outro_tec.matricula)
        
    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert exc_info.value.detail == "Chamado não está atribuído a você"
