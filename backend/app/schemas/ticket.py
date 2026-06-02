from datetime import datetime
from pydantic import BaseModel, field_validator
from typing import Optional
from app.models.ticket import TicketStatus

class TicketBase(BaseModel):
    local: str
    tipo_manutencao: str
    descricao: str

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

class TicketUpdateStatus(BaseModel):
    status: TicketStatus

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: TicketStatus) -> TicketStatus:
        allowed = [TicketStatus.NAO_INICIADO, TicketStatus.EM_ANDAMENTO, TicketStatus.CONCLUIDO]
        if v not in allowed:
            raise ValueError(f"Status not allowed. Allowed values: {[s.value for s in allowed]}")
        return v
