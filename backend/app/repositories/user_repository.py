from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole
from app.schemas.user import UserCreate

class UserRepository:
    # Pietro, 31 de Maio:
    #   Precisaria de um método 'create'?
    #   
    # Pietro, 01 de Junho:
    #   Adicionei o método 'create'.

    @staticmethod
    async def create(
        db: AsyncSession,
        user_in: 
    ) -> User:
        db_user = User(
            nome=user_in.nome,
            email=user_in.email,
            senha_hash=user_in.senha_hash,
            role=UserRole.SOLICITANTE,
            ativo=Boolean(True)
        )

        return self.update(db_user)

    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> User | None:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    @staticmethod
    async def get_by_matricula(db: AsyncSession, matricula: str) -> User | None:
        result = await db.execute(select(User).where(User.matricula == matricula))
        return result.scalars().first()

    @staticmethod
    async def get_available_technicians(db: AsyncSession) -> list[User]:
        result = await db.execute(
            select(User).where(User.role == UserRole.TECNICO, User.ativo == True)
        )
        return list(result.scalars().all())

    @staticmethod
    async def update(
        db: AsyncSession,
        db_user: User
    ) -> User:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
