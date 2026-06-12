from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, UserRole, ApprovalStatus

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
            select(User).where(User.role == UserRole.TECNICO, User.ativo == True)
        )
        return list(result.scalars().all())

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