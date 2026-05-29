from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.ticket import Ticket, TicketStatus
from app.models.user import User, UserRole
from app.repositories.ticket_repository import TicketRepository
from app.repositories.user_repository import UserRepository
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

    @staticmethod
    async def assign_technician(db: AsyncSession, ticket_id: int, tecnico_id: str) -> Ticket:
        ticket = await TicketRepository.get_by_id(db, ticket_id)
        if not ticket:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chamado não encontrado")
        
        if ticket.status != TicketStatus.ABERTO:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Chamado não está aberto")

        tecnico = await UserRepository.get_by_matricula(db, tecnico_id)
        if not tecnico or tecnico.role != UserRole.TECNICO or not tecnico.ativo:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Técnico inválido ou inativo")

        ticket.tecnico_id = tecnico.matricula
        ticket.status = TicketStatus.ATRIBUIDO
        return await TicketRepository.update(db, ticket)

    @staticmethod
    async def get_tickets_by_technician(db: AsyncSession, tecnico_id: str) -> list[Ticket]:
        return await TicketRepository.get_by_tecnico_id(db, tecnico_id)

    @staticmethod
    async def update_ticket_status(db: AsyncSession, ticket_id: int, new_status: TicketStatus, tecnico_id: str) -> Ticket:
        ticket = await TicketRepository.get_by_id(db, ticket_id)
        if not ticket:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chamado não encontrado")
        
        if ticket.tecnico_id != tecnico_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Chamado não está atribuído a você")

        ticket.status = new_status
        return await TicketRepository.update(db, ticket)
