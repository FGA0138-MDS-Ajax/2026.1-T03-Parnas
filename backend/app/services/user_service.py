from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import UserResponse
from app.repositories.user_repository import UserRepository

class UserService:

    @staticmethod
    async def create_user(
        db: AsyncSession,
        user_in: UserResponse
    ) -> User:
        return await UserRepository.create(db, user_in)

    @staticmethod
    async def get_available_technicians(db: AsyncSession) -> list[User]:
        return await UserRepository.get_available_technicians(db)
