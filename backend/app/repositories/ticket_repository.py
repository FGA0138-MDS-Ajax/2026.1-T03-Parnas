from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.ticket import Ticket, TicketStatus
from app.schemas.ticket import TicketCreate

class TicketRepository:
    @staticmethod
    async def create(db: AsyncSession, ticket_in: TicketCreate, solicitante_id: str) -> Ticket:
        db_ticket = Ticket(
            local=ticket_in.local,
            tipo_manutencao=ticket_in.tipo_manutencao,
            descricao=ticket_in.descricao,
            status=TicketStatus.ABERTO,
            solicitante_id=solicitante_id,
            tecnico_id=None
        )
        db.add(db_ticket)
        await db.commit()
        await db.refresh(db_ticket)
        return db_ticket

    @staticmethod
    async def get_by_solicitante_id(db: AsyncSession, solicitante_id: str) -> list[Ticket]:
        result = await db.execute(select(Ticket).where(Ticket.solicitante_id == solicitante_id))
        return list(result.scalars().all())

    @staticmethod
    async def get_by_status(db: AsyncSession, status: TicketStatus) -> list[Ticket]:
        result = await db.execute(select(Ticket).where(Ticket.status == status))
        return list(result.scalars().all())
