from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.user import UserRole
from app.schemas.error import error_response_docs
from app.schemas.user import UserResponse
from app.services.user_service import UserService

router = APIRouter(
    prefix="/api/v1/technicians",
    tags=["technicians"],
    responses={
        401: error_response_docs("Token ausente, inválido ou expirado."),
        403: error_response_docs("Usuário sem permissão para listar técnicos."),
    },
)

@router.get("/available", response_model=list[UserResponse])
async def get_available_technicians(
    db: AsyncSession = Depends(get_db),
    _ = Depends(require_role([UserRole.GERENTE]))
):
    return await UserService.get_available_technicians(db)
