from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.user import UserRole
from app.schemas.dashboard import DashboardSummaryResponse
from app.schemas.error import error_response_docs
from app.services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/api/v1/dashboard",
    tags=["dashboard"],
    responses={
        401: error_response_docs("Token ausente, inválido ou expirado."),
        403: error_response_docs("Usuário sem permissão para acessar o recurso."),
    },
)

@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
    dependencies=[Depends(require_role([UserRole.GERENTE, UserRole.ADMIN]))]
)
async def get_summary(db: AsyncSession = Depends(get_db)):
    """
    Retorna os indicadores gerais do dashboard e o desempenho por técnico.
    Acesso restrito a GERENTE e ADMIN.
    """
    return await DashboardService.get_summary(db)
