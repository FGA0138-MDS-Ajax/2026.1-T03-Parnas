import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.ticket import Ticket, TicketStatus
from app.models.user import User
from app.models.ticket_history import TicketHistory


@pytest.mark.asyncio
async def test_create_ticket_history_success(
    db_session: AsyncSession,
    test_solicitante: User,
    create_test_ticket
):
    """Garante que um registro de histórico pode ser criado e associado a um chamado e a um usuário."""
    # Cria o chamado
    ticket = await create_test_ticket(
        local="Prédio da Computação",
        tipo_manutencao="Lâmpada",
        descricao="Lâmpada queimada",
        solicitante_id=test_solicitante.matricula
    )

    # Cria o histórico
    history = TicketHistory(
        ticket_id=ticket.id,
        user_id=test_solicitante.matricula,
        action="Chamado criado",
        previous_status=None,
        new_status=TicketStatus.ABERTO
    )
    db_session.add(history)
    await db_session.commit()
    await db_session.refresh(history)

    # Asserts
    assert history.id is not None
    assert history.ticket_id == ticket.id
    assert history.user_id == test_solicitante.matricula
    assert history.action == "Chamado criado"
    assert history.previous_status is None
    assert history.new_status == TicketStatus.ABERTO
    assert history.created_at is not None

    # Busca do banco para certificar persistência
    stmt = select(TicketHistory).where(TicketHistory.id == history.id)
    result = await db_session.execute(stmt)
    in_db = result.scalar_one_or_none()
    assert in_db is not None
    assert in_db.action == "Chamado criado"
