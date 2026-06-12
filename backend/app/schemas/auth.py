from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    senha: str


class RegisterRequest(BaseModel):
    matricula: str = Field(..., min_length=9, max_length=9, pattern=r'^\d{9}$')
    nome: str = Field(..., max_length=100)
    email: EmailStr
    senha: str = Field(..., min_length=6)
    role: UserRole = UserRole.SOLICITANTE
    area_manutencao: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"