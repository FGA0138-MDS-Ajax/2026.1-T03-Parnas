from fastapi import APIRouter, Depends, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    ForgotPasswordRequest,
    VerifyCodeRequest,
    ResetPasswordRequest,
    ResetTokenResponse,
)
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

@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
async def forgot_password(
    request: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    await AuthService.forgot_password(db, request, background_tasks)
    return {"message": "Se o e-mail estiver cadastrado, um código de recuperação será enviado em breve."}

@router.post("/verify-code", response_model=ResetTokenResponse)
async def verify_code(
    request: VerifyCodeRequest,
    db: AsyncSession = Depends(get_db)
):
    return await AuthService.verify_code(db, request)

@router.post("/reset-password", status_code=status.HTTP_204_NO_CONTENT)
async def reset_password(
    request: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
):
    await AuthService.reset_password(db, request)
