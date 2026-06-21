import random
from fastapi import HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User, UserRole, ApprovalStatus
from app.models.ticket import Ticket
from app.models.ticket_history import TicketHistory
from app.models.comment import Comment
from app.repositories.user_repository import UserRepository
from app.schemas.admin import ManagerCreate, UserUpdateAdmin


class AdminService:
    @staticmethod
    async def get_all_users(db: AsyncSession) -> list[User]:
        """Obtém todos os usuários cadastrados no sistema."""
        return await UserRepository.get_all(db)

    @staticmethod
    async def create_manager(db: AsyncSession, manager_data: ManagerCreate) -> User:
        """Cria uma nova conta de Gerente."""
        # Verificar e-mail duplicado
        existing_email = await UserRepository.get_by_email(db, email=manager_data.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Usuário com este e-mail já existe.",
            )

        # Tratar matrícula
        matricula = manager_data.matricula
        if matricula:
            existing_matricula = await UserRepository.get_by_matricula(db, matricula=matricula)
            if existing_matricula:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Usuário com esta matrícula já existe.",
                )
        else:
            # Gerar matrícula automática para gerentes (começa com "3")
            while True:
                matricula_gerada = "3" + "".join([str(random.randint(0, 9)) for _ in range(8)])
                existing = await UserRepository.get_by_matricula(db, matricula=matricula_gerada)
                if not existing:
                    matricula = matricula_gerada
                    break

        # Criar usuário
        user = User(
            matricula=matricula,
            nome=manager_data.nome,
            email=manager_data.email,
            senha_hash=get_password_hash(manager_data.senha),
            role=UserRole.GERENTE,
            ativo=True,
            approval_status=ApprovalStatus.APROVADO,
        )

        return await UserRepository.create(db, user)

    @staticmethod
    async def update_user(db: AsyncSession, user_id: int, user_update: UserUpdateAdmin) -> User:
        """Atualiza dados de uma conta de usuário."""
        user = await UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado.",
            )

        # Se e-mail foi alterado, verificar duplicidade
        if user_update.email and user_update.email != user.email:
            existing_email = await UserRepository.get_by_email(db, email=user_update.email)
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Usuário com este e-mail já existe.",
                )

        # Aplicar alterações
        update_data = user_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)

        return await UserRepository.update(db, user)

    @staticmethod
    async def deactivate_user(db: AsyncSession, user_id: int) -> User:
        """Desativa uma conta de usuário."""
        user = await UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado.",
            )

        user.ativo = False
        return await UserRepository.update(db, user)

    @staticmethod
    async def delete_user(db: AsyncSession, user_id: int) -> None:
        """Exclui fisicamente um usuário do banco, reatribuindo dependências."""
        user = await UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado.",
            )

        # Evitar exclusão do sentinela
        if user.matricula == "000000000":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Não é possível excluir o usuário sentinela.",
            )

        # Garantir a existência do usuário sentinela
        sentinela = await UserRepository.get_by_matricula(db, matricula="000000000")
        if not sentinela:
            sentinela = User(
                matricula="000000000",
                nome="Usuário Excluído",
                email="excluido@unb.br",
                senha_hash=get_password_hash("random_unusable_pass_12345_xyz"),
                role=UserRole.SOLICITANTE,
                ativo=False,
                approval_status=ApprovalStatus.APROVADO,
            )
            await UserRepository.create(db, sentinela)

        # Reatribuir chamados onde ele é solicitante
        await db.execute(
            update(Ticket)
            .where(Ticket.solicitante_id == user.matricula)
            .values(solicitante_id="000000000")
        )

        # Reatribuir históricos de chamados
        await db.execute(
            update(TicketHistory)
            .where(TicketHistory.user_id == user.matricula)
            .values(user_id="000000000")
        )

        # Reatribuir comentários
        await db.execute(
            update(Comment)
            .where(Comment.user_id == user.matricula)
            .values(user_id="000000000")
        )

        await db.commit()

        # Efetuar a deleção física
        await UserRepository.delete(db, user)

    @staticmethod
    async def verify_pin(db: AsyncSession, user: User, pin: str) -> str:
        """Verifica o PIN do administrador e retorna um novo JWT de acesso com claim de PIN verificado."""
        if not user.admin_pin_hash:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="PIN administrativo não configurado.",
            )

        if not verify_password(pin, user.admin_pin_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="PIN incorreto.",
            )

        # Retorna o token com a claim pin_verified=True
        return create_access_token(
            subject=user.matricula,
            additional_claims={"pin_verified": True}
        )

    @staticmethod
    async def change_pin(db: AsyncSession, user: User, current_pin: str, new_pin: str) -> None:
        """Altera o PIN do administrador logado."""
        if not user.admin_pin_hash:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="PIN administrativo não configurado.",
            )

        if not verify_password(current_pin, user.admin_pin_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="PIN atual incorreto.",
            )

        user.admin_pin_hash = get_password_hash(new_pin)
        await UserRepository.update(db, user)
