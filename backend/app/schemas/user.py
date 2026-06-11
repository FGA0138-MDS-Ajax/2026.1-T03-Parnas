from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole, ApprovalStatus

class UserResponse(BaseModel):
    id: int
    matricula: str
    nome: str
    email: EmailStr
    role: UserRole
    ativo: bool
    approval_status: ApprovalStatus
    area_manutencao: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
