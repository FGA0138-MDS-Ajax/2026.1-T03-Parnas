from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import verify_password, create_access_token, get_password_hash
from app.models.user import User, ApprovalStatus, UserRole
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse

class AuthService:
    @staticmethod
    async def authenticate_user(
        db: AsyncSession, login_data: LoginRequest
    ) -> TokenResponse:
        user = await UserRepository.get_by_email(db, email=login_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        if not verify_password(login_data.senha, user.senha_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        if user.approval_status == ApprovalStatus.PENDENTE:
            mensagem_erro = "O seu cadastro de Técnico está em análise. Aguarde a aprovação."
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=mensagem_erro,
                )

        elif user.approval_status == ApprovalStatus.REPROVADO:
            mensagem_erro = "O seu cadastro de Técnico foi reprovado."
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=mensagem_erro,
                )

        if not user.ativo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Usuário inativo",
            )
            
        access_token = create_access_token(subject=user.matricula)
        return TokenResponse(access_token=access_token, token_type="bearer")

    @staticmethod
    async def register_user(
        db: AsyncSession, register_data: RegisterRequest
    ) -> TokenResponse:
        # Check if user already exists
        existing_user = await UserRepository.get_by_email(db, email=register_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Usuário com este email já existe",
            )

        if register_data.role in [UserRole.GERENTE, UserRole.ADMIN]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Não é possível criar contas de Gerente ou Administrador por esta rota.",
            )

        # Definindo Status de aprovação baseado na Role
        status_aprovacao = ApprovalStatus.APROVADO
        usuario_ativo = True
        if register_data.role == UserRole.TECNICO:
            status_aprovacao = ApprovalStatus.PENDENTE
            usuario_ativo = False

        # Create new user
        user = User(
            matricula=register_data.matricula,
            nome=register_data.nome,
            email=register_data.email,
            senha_hash=get_password_hash(register_data.senha),
            role=register_data.role,
            ativo=usuario_ativo,
            approval_status=status_aprovacao,
            area_manutencao=register_data.area_manutencao
        )

        created_user = await UserRepository.create(db, user)

        # Técnico pendente não deve receber token de acesso
        if created_user.approval_status == ApprovalStatus.PENDENTE:
            raise HTTPException(
                status_code=status.HTTP_202_ACCEPTED,
                detail="Cadastro realizado com sucesso. Aguarde a aprovação do gerente.",
            )

        access_token = create_access_token(subject=created_user.matricula)
        return TokenResponse(access_token=access_token, token_type="bearer")