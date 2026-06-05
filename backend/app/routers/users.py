from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.error import error_response_docs
from app.schemas.user import UserResponse

router = APIRouter(
    prefix="/api/v1/users",
    tags=["users"],
    responses={
        401: error_response_docs("Token ausente, inválido ou expirado."),
        403: error_response_docs("Usuário sem permissão para acessar o recurso."),
    },
)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User=Depends(get_current_user)):
    return current_user
