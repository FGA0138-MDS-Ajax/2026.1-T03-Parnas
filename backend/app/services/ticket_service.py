from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.ticket import Ticket, TicketStatus
from app.models.user import User, UserRole
from app.repositories.ticket_repository import TicketRepository
from app.repositories.user_repository import UserRepository
from app.repositories.ticket_history_repository import TicketHistoryRepository
from app.schemas.ticket import TicketCreate

class TicketService:
    @staticmethod
    # Registro do evento de criação do chamado
    async def create_ticket(db: AsyncSession, ticket_in: TicketCreate, user: User) -> Ticket:
        ticket = await TicketRepository.create(db, ticket_in, user.matricula)
        await TicketHistoryRepository.create_entry(
            db, ticket_id=ticket.id, user_id=user.matricula, action="Chamado criado"
        )
        return ticket

    @staticmethod
    async def get_user_tickets(db: AsyncSession, user: User) -> list[Ticket]:
        return await TicketRepository.get_by_solicitante_id(db, user.matricula)

    @staticmethod
    async def get_open_tickets(db: AsyncSession) -> list[Ticket]:
        return await TicketRepository.get_by_status(db, TicketStatus.ABERTO)

    @staticmethod
    async def get_open_tickets_by_others(db: AsyncSession, user: User) -> list[Ticket]:
        return await TicketRepository.get_open_by_others(db, user.matricula)

    @staticmethod
    async def get_all_tickets(db: AsyncSession) -> list[Ticket]:
        return await TicketRepository.get_all(db)

    @staticmethod
    async def get_in_progress_tickets(db: AsyncSession) -> list[Ticket]:
        return await TicketRepository.get_by_statuses(
            db,
            [TicketStatus.ATRIBUIDO, TicketStatus.EM_ANDAMENTO],
        )

    @staticmethod
    async def assign_technician(db: AsyncSession, ticket_id: int, tecnico_id: str, manager_id: str) -> Ticket:
        ticket = await TicketRepository.get_by_id(db, ticket_id)
        if not ticket:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chamado não encontrado")
        
        # Gerente não consegue atribuir técnico a chamado já concluído
        if ticket.status == TicketStatus.CONCLUIDO:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Não é possível atribuir técnico a um chamado já concluído"
            )
        
        # Validação para garantir que o chamado atual esteja com o status ABERTO
        if ticket.status != TicketStatus.ABERTO:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="O chamado precisa estar com o status ABERTO para receber uma atribuição"
            )

        # 2. Busca o usuário técnico pela matrícula no repositório
        tecnico = await UserRepository.get_by_matricula(db, tecnico_id)
        
        # Gerente não consegue atribuir técnico inexistente
        if not tecnico:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="O técnico informado não existe no sistema"
            )
            
        # Gerente não consegue atribuir usuário que não seja técnico
        if tecnico.role != UserRole.TECNICO:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="O usuário selecionado não possui o perfil de TÉCNICO"
            )
            
        # Validação de integridade para confirmar que o técnico está ativo
        if not tecnico.ativo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="O técnico selecionado está inativo no sistema"
            )

        #Atualização automática dos campos e do status para ATRIBUIDO
        ticket.tecnico_id = tecnico.matricula
        ticket.status = TicketStatus.ATRIBUIDO
        
        updated_ticket = await TicketRepository.update(db, ticket)

        # Registro do evento de alteração de técnico atribuído e mudança de status
        await TicketHistoryRepository.create_entry(
            db, ticket_id=ticket.id, user_id=manager_id, action=f"Técnico atribuído: {tecnico_id}"
        )
        await TicketHistoryRepository.create_entry(
            db, ticket_id=ticket.id, user_id=manager_id, action="Status alterado para: ATRIBUIDO"
        )
        
        return updated_ticket

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
        updated_ticket = await TicketRepository.update(db, ticket)

        # Registro do evento de mudança nos status (EM_ANDAMENTO, CONCLUIDO, etc.)
        await TicketHistoryRepository.create_entry(
            db, ticket_id=ticket.id, user_id=tecnico_id, action=f"Status alterado para: {new_status.value}"
        )
        return updated_ticket

    # Disponibilização do histórico em leitura
    @staticmethod
    async def get_ticket_detail_with_history(db: AsyncSession, ticket_id: int, user: User) -> dict:
        ticket = await TicketRepository.get_by_id(db, ticket_id)
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chamado não encontrado.")
        
        # Bloqueia Técnicos 
        if user.role == UserRole.TECNICO and ticket.tecnico_id != user.matricula:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuário não possui permissão para acessar este recurso.")
        
        history = await TicketHistoryRepository.get_by_ticket_id(db, ticket_id)
        
        # Retorna os dados do chamado juntos com o seu histórico (linha do tempo)
        return {
            "ticket": ticket,
            "history": history
        }