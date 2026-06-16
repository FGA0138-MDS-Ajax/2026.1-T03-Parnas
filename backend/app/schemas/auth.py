from typing import Optional

from pydantic import BaseModel, EmailStr, Field, model_validator

from app.models.user import UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    senha: str


class RegisterRequest(BaseModel):
    matricula: Optional[str] = Field(None, min_length=9, max_length=9, pattern=r'^\d{9}$')
    nome: str = Field(..., max_length=100)
    email: EmailStr
    senha: str = Field(..., min_length=6)
    role: UserRole = UserRole.SOLICITANTE
    area_manutencao: Optional[str] = None

    @model_validator(mode='after')
    def validate_fields(self) -> 'RegisterRequest':
        if self.role not in [UserRole.SOLICITANTE, UserRole.TECNICO]:
            raise ValueError("Perfil de usuário inválido para cadastro público.")
        
        if self.role == UserRole.SOLICITANTE:
            if not self.matricula:
                raise ValueError("Matrícula é obrigatória para solicitante.")
        elif self.role == UserRole.TECNICO:
            if not self.area_manutencao or not self.area_manutencao.strip():
                raise ValueError("Área de manutenção é obrigatória para técnico.")
        return self


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"