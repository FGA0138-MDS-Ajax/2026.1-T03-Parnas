from sqlalchemy.ext.asyncio import AsyncSession
from app.models.ticket import Ticket, TicketStatus
from app.models.user import User
from app.repositories.ticket_repository import TicketRepository
from app.schemas.ticket import TicketCreate

class TicketService:
    @staticmethod
    async def create_ticket(db: AsyncSession, ticket_in: TicketCreate, user: User) -> Ticket:
        return await TicketRepository.create(db, ticket_in, user.matricula)

    @staticmethod
    async def get_user_tickets(db: AsyncSession, user: User) -> list[Ticket]:
        return await TicketRepository.get_by_solicitante_id(db, user.matricula)

    @staticmethod
    async def get_open_tickets(db: AsyncSession) -> list[Ticket]:
        return await TicketRepository.get_by_status(db, TicketStatus.ABERTO)
