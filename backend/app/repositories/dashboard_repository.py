from sqlalchemy import select, func, case
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ticket import Ticket, TicketStatus
from app.models.user import User, UserRole, ApprovalStatus
from app.schemas.dashboard import TicketTypeCount

class DashboardRepository:
    @staticmethod
    async def get_ticket_counts_by_status(db: AsyncSession):
        query = select(Ticket.status, func.count(Ticket.id)).group_by(Ticket.status)
        result = await db.execute(query)
        counts = result.all()
        return {status.value: count for status, count in counts}

    @staticmethod
    async def get_technician_counts(db: AsyncSession):
        query = select(User.approval_status, func.count(User.id)).where(User.role == UserRole.TECNICO).group_by(User.approval_status)
        result = await db.execute(query)
        counts = result.all()
        return {status.value: count for status, count in counts}

    @staticmethod
    async def get_ticket_counts_by_type(db: AsyncSession) -> list[TicketTypeCount]:
        query = select(Ticket.tipo_manutencao, func.count(Ticket.id)).group_by(Ticket.tipo_manutencao)
        result = await db.execute(query)
        counts = result.all()
        return [TicketTypeCount(tipo_manutencao=tipo, quantidade=count) for tipo, count in counts]

    @staticmethod
    async def get_technician_performance(db: AsyncSession):
        query = (
            select(
                User.matricula,
                User.nome,
                func.sum(
                    case((Ticket.status.in_([TicketStatus.ATRIBUIDO, TicketStatus.EM_ANDAMENTO]), 1), else_=0)
                ).label("atribuidos_ativos"),
                func.sum(
                    case((Ticket.status == TicketStatus.CONCLUIDO, 1), else_=0)
                ).label("concluidos")
            )
            .outerjoin(Ticket, User.matricula == Ticket.tecnico_id)
            .where(User.role == UserRole.TECNICO)
            .where(User.approval_status == ApprovalStatus.APROVADO)
            .where(User.ativo == True)
            .group_by(User.matricula, User.nome)
        )
        result = await db.execute(query)
        return result.all()
