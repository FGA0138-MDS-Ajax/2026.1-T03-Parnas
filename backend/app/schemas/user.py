from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

class UserResponse(BaseModel):
    matricula: str
    nome: str
    email: EmailStr
    role: UserRole
    ativo: bool
    created_at: datetime

    model_config = {"from_attributes": True}
