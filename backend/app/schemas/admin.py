from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole, ApprovalStatus


class ManagerCreate(BaseModel):
    matricula: Optional[str] = Field(None, min_length=9, max_length=9, pattern=r"^\d{9}$")
    nome: str = Field(..., max_length=100)
    email: EmailStr
    senha: str = Field(..., min_length=6)


class UserUpdateAdmin(BaseModel):
    nome: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    ativo: Optional[bool] = None
    approval_status: Optional[ApprovalStatus] = None
    area_manutencao: Optional[str] = Field(None, max_length=100)


class PinVerifyRequest(BaseModel):
    pin: str = Field(..., min_length=4, max_length=6, pattern=r"^\d+$")


class PinChangeRequest(BaseModel):
    current_pin: str = Field(..., min_length=4, max_length=6, pattern=r"^\d+$")
    new_pin: str = Field(..., min_length=4, max_length=6, pattern=r"^\d+$")
