from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import verify_password, create_access_token, get_password_hash
from app.models.user import User
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

        # Create new user
        user = User(
            matricula=register_data.matricula,
            nome=register_data.nome,
            email=register_data.email,
            senha_hash=get_password_hash(register_data.senha),
            role=register_data.role,
            ativo=True
        )
        
        created_user = await UserRepository.create(db, user)
        access_token = create_access_token(subject=created_user.matricula)
        return TokenResponse(access_token=access_token, token_type="bearer")