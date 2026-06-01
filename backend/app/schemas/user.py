from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

class UserBase(BaseModel):
    nome: str
    email: EmailStr
    role: UserRole
    ativo: bool

class TicketCreate(UserBase):
    pass

class UserResponse(UserBase):
    matricula: str
    created_at: datetime

    model_config = {"from_attributes": True}
