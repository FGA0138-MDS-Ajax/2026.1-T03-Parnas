from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.models.user import User, UserRole
from app.schemas.ticket import TicketCreate, TicketResponse
from app.services.ticket_service import TicketService

router = APIRouter(prefix="/api/v1/tickets", tags=["tickets"])

@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(
    ticket_in: TicketCreate,
    current_user: User = Depends(require_role([UserRole.SOLICITANTE])),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.create_ticket(db, ticket_in, current_user)

@router.get("/me", response_model=list[TicketResponse])
async def get_my_tickets(
    current_user: User = Depends(require_role([UserRole.SOLICITANTE])),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.get_user_tickets(db, current_user)

@router.get("/open", response_model=list[TicketResponse])
async def get_open_tickets(
    current_user: User = Depends(require_role([UserRole.GERENTE])),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.get_open_tickets(db)
