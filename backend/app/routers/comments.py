#Pietro, 31 de Maio

# A função do router é configurar os endpoints que o usuário acessa, eu acho

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role

from app.models.user import User, UserRole

from app.schemas.ticket import TicketCreate, TicketResponse, TicketAssign, TicketUpdateStatus
from app.services.ticket_service import TicketService

from app.schemas.comment import CommentCreate, CommentResponse, CommentUpdate
from app.services.comment_service import CommentService

router = APIRouter(prefix="/api/v1/comments", tags=["comments"])

#POST: create_comment
#   Cria um comentário.
@router.post("", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    ticket_in: CommentCreate,
    ticket_id: int,
    current_user: User=Depends(require_role([UserRole.SOLICITANTE])),
    db: AsyncSession=Depends(get_db),
):
    return await CommentService.create_comment(db, ticket_in, current_user, ticket_id)


#GET: get_my_comments
#   Retorna os comentários do usuário atual.
@router.get("/me", response_model=list[CommentResponse])
async def get_my_comments(
    current_user: User=Depends(require_role([UserRole.SOLICITANTE])),
    db: AsyncSession=Depends(get_db),
):
    return await CommentService.get_user_comments(db, current_user.matricula)


#GET: get_user_comments
#   Retorna os comentários de um usuário qualquer, por ID.
@router.get("/user", response_model=list[CommentResponse])
async def get_user_comments(
    target_user_id: str,
    current_user: User=Depends(require_role([UserRole.SOLICITANTE])),
    db: AsyncSession=Depends(get_db),
):

    return await CommentService.get_user_comments(db, target_user_id)


#GET: get_ticket_comments
#   Retorna os comentários sob um ticket qualquer, por ID.
@router.get("/ticket", response_model=list[CommentResponse])
async def get_ticket_comments(
    ticket_id: int,
    current_user: User=Depends(require_role([UserRole.SOLICITANTE])),
    db: AsyncSession=Depends(get_db),
):
    return await CommentService.get_ticket_comments(db, ticket_id)


#PATCH: update_comment_ocultar
#   Oculta um comentário.
#   (TODO), verificar quem está ocultando o comentário.
@router.patch("{comment_id}/ocultar", response_model=list[CommentResponse])
async def update_comment_ocultar(
    comment_id: int,
    ####Requer que o usuário seja administrador ou gerente.
    current_user: User=Depends(require_role([UserRole.ADMIN, UserRole.GERENTE])),
    db: AsyncSession=Depends(get_db),
):

    return await CommentService.update_comment_ocultado(db, comment_id, True)


#PATCH: update_comment_revelar
#   Revela um comentário.
#   (TODO), verificar quem está revelando o comentário.
@router.patch("{comment_id}/revelar", response_model=list[CommentResponse])
async def update_comment_revelar(
    comment_id: int,
    current_user: User=Depends(require_role([UserRole.ADMIN, UserRole.GERENTE])),
    db: AsyncSession=Depends(get_db),
):

    return await CommentService.update_comment_ocultado(db, comment_id, False)
