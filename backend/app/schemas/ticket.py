from datetime import datetime
from pydantic import BaseModel
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
