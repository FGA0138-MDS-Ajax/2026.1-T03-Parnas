from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.repositories.user_repository import UserRepository

class UserService:
    @staticmethod
    async def create_user(db: AsyncSession, user: User) -> User:
        return await UserRepository.create(db, user)

    @staticmethod
    async def get_available_technicians(db: AsyncSession) -> list[User]:
        return await UserRepository.get_available_technicians(db)