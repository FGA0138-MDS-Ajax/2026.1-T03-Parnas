from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User

class UserRepository:
    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> User | None:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    @staticmethod
    async def get_by_matricula(db: AsyncSession, matricula: str) -> User | None:
        result = await db.execute(select(User).where(User.matricula == matricula))
        return result.scalars().first()
