from datetime import datetime
from pydantic import BaseModel, field_validator, Field, ValidationInfo
from typing import Optional
from app.models.ticket import TicketStatus

class TicketBase(BaseModel):
    local: str = Field(..., max_length=200)
    tipo_manutencao: str = Field(..., max_length=100)
    descricao: str
    photo_path: Optional[str] = Field(None, max_length=500)

    @field_validator("local", "tipo_manutencao", "descricao")
    @classmethod
    def check_not_empty(cls, v: str, info: ValidationInfo) -> str:
        if not v or not v.strip():
            raise ValueError(f"O campo '{info.field_name}' não pode estar vazio.")
        return v.strip()

class TicketCreate(TicketBase):
    pass

class TicketResponse(TicketBase):
    id: int
    status: TicketStatus
    solicitante_id: str
    tecnico_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class TicketAssign(BaseModel):
    tecnico_id: str

class TicketTechnicianSuggestionResponse(BaseModel):
    tecnico_id: str
    nome: str
    area_manutencao: str
    quantidade_chamados_ativos: int

class TicketUpdateStatus(BaseModel):
    status: TicketStatus

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: TicketStatus) -> TicketStatus:
        allowed = [TicketStatus.NAO_INICIADO, TicketStatus.EM_ANDAMENTO, TicketStatus.CONCLUIDO]
        if v not in allowed:
            raise ValueError(f"Status not allowed. Allowed values: {[s.value for s in allowed]}")
        return v

class TicketPublicResponse(TicketBase):
    id: int
    status: TicketStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
