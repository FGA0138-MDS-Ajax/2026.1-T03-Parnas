from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

import secrets
from datetime import datetime, timedelta, timezone
from jose import jwt
from fastapi import BackgroundTasks
from app.core.config import settings
from app.models.password_reset_code import PasswordResetCode
from app.repositories.password_reset_repository import PasswordResetRepository
from app.services.email_service import EmailService
from app.core.security import verify_password, create_access_token, get_password_hash
from app.models.user import User, ApprovalStatus, UserRole
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    ForgotPasswordRequest,
    VerifyCodeRequest,
    ResetPasswordRequest,
    ResetTokenResponse,
)

class AuthService:
    @staticmethod
    async def authenticate_user(
        db: AsyncSession, login_data: LoginRequest
    ) -> TokenResponse:
        user = await UserRepository.get_by_email(db, email=login_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos.",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        now_utc = datetime.now(timezone.utc)
        
        if user.login_blocked_until and user.login_blocked_until > now_utc:
            remaining = user.login_blocked_until - now_utc
            minutes = int(remaining.total_seconds() // 60)
            seconds = int(remaining.total_seconds() % 60)
            tempo_msg = f"{minutes} minutos e {seconds} segundos" if minutes > 0 else f"{seconds} segundos"
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Conta bloqueada temporariamente devido a excesso de tentativas. Tente novamente em {tempo_msg}.",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        if not verify_password(login_data.senha, user.senha_hash):
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= settings.MAX_LOGIN_ATTEMPTS:
                user.login_blocked_until = now_utc + timedelta(minutes=settings.LOGIN_LOCKOUT_MINUTES)
                await UserRepository.update(db, user)
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Email ou senha incorretos. Limite de tentativas atingido. Conta bloqueada por {settings.LOGIN_LOCKOUT_MINUTES} minutos.",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            else:
                restantes = settings.MAX_LOGIN_ATTEMPTS - user.failed_login_attempts
                await UserRepository.update(db, user)
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Email ou senha incorretos. Você tem mais {restantes} tentativas.",
                    headers={"WWW-Authenticate": "Bearer"},
                )
                
        if user.failed_login_attempts > 0 or user.login_blocked_until is not None:
            user.failed_login_attempts = 0
            user.login_blocked_until = None
            await UserRepository.update(db, user)
            
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
                detail="Usuário inativo.",
            )
            
        access_token = create_access_token(subject=user.matricula)
        return TokenResponse(access_token=access_token, token_type="bearer")

    @staticmethod
    async def register_user(
        db: AsyncSession, register_data: RegisterRequest
    ) -> TokenResponse:
        # Check if user already exists by email
        existing_user = await UserRepository.get_by_email(db, email=register_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Usuário com este email já existe.",
            )

        if register_data.role in [UserRole.GERENTE, UserRole.ADMIN]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Não é possível criar contas de Gerente ou Administrador por esta rota.",
            )

        # Check if matricula already exists (if provided)
        if register_data.matricula:
            existing_matricula = await UserRepository.get_by_matricula(db, matricula=register_data.matricula)
            if existing_matricula:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Usuário com esta matrícula já existe.",
                )

        # Gerar matrícula automática para técnicos caso não informada
        if register_data.role == UserRole.TECNICO and not register_data.matricula:
            import random
            while True:
                matricula_gerada = "9" + "".join([str(random.randint(0, 9)) for _ in range(8)])
                existing = await UserRepository.get_by_matricula(db, matricula=matricula_gerada)
                if not existing:
                    register_data.matricula = matricula_gerada
                    break

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

    @staticmethod
    async def forgot_password(
        db: AsyncSession, request: ForgotPasswordRequest, background_tasks: BackgroundTasks
    ) -> None:
        user = await UserRepository.get_by_email(db, email=request.email)
        if not user or not user.ativo:
            return

        code = "".join(str(secrets.randbelow(10)) for _ in range(6))
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

        reset_code = PasswordResetCode(
            email=user.email,
            code=code,
            expires_at=expires_at
        )
        await PasswordResetRepository.create(db, reset_code)

        background_tasks.add_task(
            EmailService.send_recovery_email, user.email, code
        )

    @staticmethod
    async def verify_code(
        db: AsyncSession, request: VerifyCodeRequest
    ) -> ResetTokenResponse:
        active_code = await PasswordResetRepository.get_active_code(db, email=request.email)
        if not active_code or active_code.code != request.code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Código inválido ou expirado."
            )

        await PasswordResetRepository.mark_as_used(db, active_code)

        expire = datetime.now(timezone.utc) + timedelta(minutes=5)
        to_encode = {"exp": expire, "sub": request.email, "type": "reset"}
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")

        return ResetTokenResponse(reset_token=encoded_jwt)

    @staticmethod
    async def reset_password(
        db: AsyncSession, request: ResetPasswordRequest
    ) -> None:
        try:
            payload = jwt.decode(request.token, settings.SECRET_KEY, algorithms=["HS256"])
            email: str = payload.get("sub")
            token_type: str = payload.get("type")
            if token_type != "reset" or not email:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido.")
        except jwt.JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido ou expirado.")

        user = await UserRepository.get_by_email(db, email=email)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")

        user.senha_hash = get_password_hash(request.nova_senha)
        await UserRepository.update(db, user)