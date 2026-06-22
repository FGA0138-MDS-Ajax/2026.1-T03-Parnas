from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, status
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_role, get_current_user
from app.models.user import User, UserRole
from app.schemas.error import error_response_docs
from app.schemas.ticket import (
    TicketAssign,
    TicketCreate,
    TicketPublicResponse,
    TicketResponse,
    TicketTechnicianSuggestionResponse,
    TicketUpdateStatus,
)
from app.services.ticket_service import TicketService

router = APIRouter(
    prefix="/api/v1/tickets",
    tags=["tickets"],
    responses={
        400: error_response_docs("Dados inválidos ou regra de negócio não atendida."),
        401: error_response_docs("Token ausente, inválido ou expirado."),
        403: error_response_docs("Usuário sem permissão para executar a operação."),
        404: error_response_docs("Chamado não encontrado."),
    },
)

BACKEND_DIR = Path(__file__).resolve().parents[2]
TICKET_UPLOAD_DIR = BACKEND_DIR / "uploads" / "tickets"
MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_PHOTO_EXTENSIONS = {".jpg", ".jpeg", ".png"}
ALLOWED_PHOTO_CONTENT_TYPES = {"image/jpeg", "image/png"}


@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(
    request: Request,
    current_user: User = Depends(require_role([UserRole.SOLICITANTE])),
    db: AsyncSession = Depends(get_db),
):
    ticket_in = await _parse_ticket_create_request(request)
    return await TicketService.create_ticket(db, ticket_in, current_user)


async def _parse_ticket_create_request(request: Request) -> TicketCreate:
    content_type = request.headers.get("content-type", "")

    if content_type.startswith("multipart/form-data"):
        form = await request.form()
        photos = form.getlist("photos")

        valid_photos = [p for p in photos if _is_uploaded_file(p) and getattr(p, "filename", "")]
        
        if len(valid_photos) > 3:
            from fastapi import HTTPException, status
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Você pode anexar no máximo 3 fotos por chamado.",
            )

        ticket_in = _build_ticket_create(
            {
                "local": form.get("local"),
                "tipo_manutencao": form.get("tipo_manutencao"),
                "descricao": form.get("descricao"),
            }
        )
        
        if valid_photos:
            photo_paths = []
            for p in valid_photos:
                photo_paths.append(await _save_ticket_photo(p))
            return ticket_in.model_copy(update={"photo_paths": photo_paths})

        return ticket_in


    else:
        payload = await request.json()

    return _build_ticket_create(payload)


def _build_ticket_create(payload: dict) -> TicketCreate:
    try:
        return TicketCreate(**payload)
    except ValidationError as exc:
        raise RequestValidationError(_with_body_location(exc.errors())) from exc


def _with_body_location(errors: list[dict]) -> list[dict]:
    normalized_errors = []
    for error in errors:
        loc = tuple(error.get("loc", ()))
        normalized_errors.append({**error, "loc": ("body", *loc)})
    return normalized_errors


def _is_uploaded_file(value: object) -> bool:
    return isinstance(value, UploadFile) or (
        hasattr(value, "filename") and hasattr(value, "content_type") and hasattr(value, "read")
    )


async def _save_ticket_photo(photo: UploadFile) -> str:
    extension = Path(photo.filename or "").suffix.lower()
    if extension not in ALLOWED_PHOTO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato de foto inválido. Envie apenas arquivos .jpg, .jpeg ou .png.",
        )

    if photo.content_type not in ALLOWED_PHOTO_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipo de arquivo inválido. Envie apenas imagens JPG ou PNG.",
        )

    TICKET_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4().hex}{extension}"
    destination = TICKET_UPLOAD_DIR / filename
    total_size = 0

    try:
        with destination.open("wb") as file:
            while chunk := await photo.read(1024 * 1024):
                total_size += len(chunk)
                if total_size > MAX_PHOTO_SIZE_BYTES:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="A foto deve ter no máximo 10MB.",
                    )
                file.write(chunk)
    except HTTPException:
        destination.unlink(missing_ok=True)
        raise
    finally:
        await photo.close()

    return f"/uploads/tickets/{filename}"


@router.get("/me", response_model=list[TicketResponse])
async def get_my_tickets(
    current_user: User = Depends(require_role([UserRole.SOLICITANTE])),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.get_user_tickets(db, current_user)


@router.get("/open/others", response_model=list[TicketPublicResponse])
async def get_open_tickets_by_others(
    current_user: User = Depends(require_role([UserRole.SOLICITANTE])),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.get_open_tickets_by_others(db, current_user)


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

@router.get("/public", response_model=list[TicketPublicResponse])
async def get_all_tickets_public(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.get_all_tickets(db)


@router.get("/assigned-to-me", response_model=list[TicketResponse])
async def get_assigned_tickets(
    current_user: User = Depends(require_role([UserRole.TECNICO])),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.get_tickets_by_technician(db, current_user.matricula)


@router.get(
    "/{ticket_id}/suggest-technician",
    response_model=TicketTechnicianSuggestionResponse,
    summary="Sugerir técnico para um chamado",
)
async def suggest_technician(
    ticket_id: int,
    current_user: User = Depends(require_role([UserRole.GERENTE])),
    db: AsyncSession = Depends(get_db),
):
    """Sugere o técnico aprovado, ativo e compatível com menor carga de chamados ativos."""
    return await TicketService.suggest_technician(db, ticket_id)


@router.patch("/{ticket_id}/assign", response_model=TicketResponse)
async def assign_ticket(
    ticket_id: int,
    assignment: TicketAssign,
    current_user: User = Depends(require_role([UserRole.GERENTE])),
    db: AsyncSession = Depends(get_db),
):
    # Passar a matrícula do gerente logado (current_user.matricula)
    return await TicketService.assign_technician(db, ticket_id, assignment.tecnico_id, current_user.matricula)


@router.patch("/{ticket_id}/status", response_model=TicketResponse)
async def update_ticket_status(
    ticket_id: int,
    status_update: TicketUpdateStatus,
    current_user: User = Depends(require_role([UserRole.TECNICO])),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.update_ticket_status(db, ticket_id, status_update.status, current_user.matricula)


# Retorna o detalhe do chamado agregado com o histórico de alterações
@router.get("/{ticket_id}", status_code=status.HTTP_200_OK)
async def get_ticket_detail(
    ticket_id: int,
    current_user: User = Depends(require_role([UserRole.SOLICITANTE, UserRole.TECNICO, UserRole.GERENTE])),
    db: AsyncSession = Depends(get_db),
):
    return await TicketService.get_ticket_detail_with_history(db, ticket_id, current_user)
