from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.error import error_response_docs
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["auth"],
    responses={
        400: error_response_docs("Dados inválidos ou usuário inativo."),
        401: error_response_docs("Credenciais inválidas."),
    },
)

@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await AuthService.authenticate_user(db, login_data)

@router.post("/register", response_model=TokenResponse)
async def register(register_data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    return await AuthService.register_user(db, register_data)
