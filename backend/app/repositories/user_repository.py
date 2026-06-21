from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, UserRole, ApprovalStatus
from app.models.ticket import Ticket, TicketStatus

class UserRepository:
    @staticmethod
    async def create(db: AsyncSession, user: User) -> User:
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> User | None:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    @staticmethod
    async def get_by_matricula(db: AsyncSession, matricula: str) -> User | None:
        result = await db.execute(select(User).where(User.matricula == matricula))
        return result.scalars().first()

    @staticmethod
    async def get_by_id(db: AsyncSession, user_id: int) -> User | None:
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalars().first()

    @staticmethod
    async def get_available_technicians(db: AsyncSession) -> list[User]:
        result = await db.execute(
            select(User).where(
                User.role == UserRole.TECNICO,
                User.ativo == True,
                User.approval_status == ApprovalStatus.APROVADO,
            )
        )
        return list(result.scalars().all())

    @staticmethod
    async def suggest_technician_by_area(
        db: AsyncSession,
        tipo_manutencao: str,
    ) -> tuple[User, int] | None:
        active_ticket_count = func.count(Ticket.id).label("active_ticket_count")
        active_statuses = [
            TicketStatus.ABERTO,
            TicketStatus.ATRIBUIDO,
            TicketStatus.EM_ANDAMENTO,
            TicketStatus.NAO_INICIADO,
        ]
        result = await db.execute(
            select(User, active_ticket_count)
            .outerjoin(
                Ticket,
                (Ticket.tecnico_id == User.matricula)
                & (Ticket.status.in_(active_statuses)),
            )
            .where(
                User.role == UserRole.TECNICO,
                User.ativo == True,
                User.approval_status == ApprovalStatus.APROVADO,
                func.lower(func.trim(User.area_manutencao)) == tipo_manutencao.strip().lower(),
            )
            .group_by(User.matricula)
            .order_by(active_ticket_count.asc(), User.nome.asc())
            .limit(1)
        )
        row = result.first()
        if not row:
            return None
        return row[0], row[1]

    @staticmethod
    async def get_pending_technicians(db: AsyncSession) -> list[User]:
        result = await db.execute(
            select(User).where(
                User.role == UserRole.TECNICO,
                User.approval_status == ApprovalStatus.PENDENTE
            )
        )
        return list(result.scalars().all())

    @staticmethod
    async def update(db: AsyncSession, db_user: User) -> User:
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user
