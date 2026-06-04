from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.user import User, UserRole
from app.schemas.ticket import TicketCreate, TicketResponse, TicketAssign, TicketUpdateStatus
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


@router.get("/in-progress", response_model=list[TicketResponse])
async def get_in_progress_tickets(
    current_user: User = Depends(require_role([UserRole.GERENTE])),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.get_in_progress_tickets(db)


@router.get("", response_model=list[TicketResponse])
async def get_all_tickets(
    current_user: User = Depends(require_role([UserRole.GERENTE])),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.get_all_tickets(db)


@router.get("/assigned-to-me", response_model=list[TicketResponse])
async def get_assigned_tickets(
    current_user: User = Depends(require_role([UserRole.TECNICO])),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.get_tickets_by_technician(db, current_user.matricula)


@router.patch("/{ticket_id}/assign", response_model=TicketResponse)
async def assign_ticket(
    ticket_id: int,
    assignment: TicketAssign,
    current_user: User = Depends(require_role([UserRole.GERENTE])),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.assign_technician(db, ticket_id, assignment.tecnico_id)


@router.patch("/{ticket_id}/status", response_model=TicketResponse)
async def update_ticket_status(
    ticket_id: int,
    status_update: TicketUpdateStatus,
    current_user: User = Depends(require_role([UserRole.TECNICO])),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.update_ticket_status(db, ticket_id, status_update.status, current_user.matricula)
