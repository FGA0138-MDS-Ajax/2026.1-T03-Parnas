from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, ApprovalStatus, UserRole
from app.repositories.user_repository import UserRepository

class UserService:
    @staticmethod
    async def create_user(db: AsyncSession, user: User) -> User:
        return await UserRepository.create(db, user)

    @staticmethod
    async def get_available_technicians(db: AsyncSession) -> list[User]:
        return await UserRepository.get_available_technicians(db)

    @staticmethod
    async def get_pending_technicians(db: AsyncSession) -> list[User]:
        return await UserRepository.get_pending_technicians(db)

    @staticmethod
    async def approve_technician(db: AsyncSession, user_id: int) -> User:
        user = await UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Técnico não encontrado."
            )
        if user.role != UserRole.TECNICO:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="O usuário informado não é um técnico."
            )
        user.ativo = True
        user.approval_status = ApprovalStatus.APROVADO
        return await UserRepository.update(db, user)

    @staticmethod
    async def reject_technician(db: AsyncSession, user_id: int) -> User:
        user = await UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Técnico não encontrado."
            )
        if user.role != UserRole.TECNICO:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="O usuário informado não é um técnico."
            )
        user.ativo = False
        user.approval_status = ApprovalStatus.REPROVADO
        return await UserRepository.update(db, user)