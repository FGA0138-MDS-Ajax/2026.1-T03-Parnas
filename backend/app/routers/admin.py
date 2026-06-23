from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_role, require_admin_pin
from app.models.user import User, UserRole
from app.schemas.admin import (
    ManagerCreate,
    UserUpdateAdmin,
    PinVerifyRequest,
    PinChangeRequest,
)
from app.schemas.user import UserResponse
from app.schemas.error import error_response_docs
from app.services.admin_service import AdminService

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["admin"],
    responses={
        400: error_response_docs("Dados inválidos ou regra de negócio não atendida."),
        401: error_response_docs("Token ausente, inválido ou expirado."),
        403: error_response_docs("Usuário sem permissão para acessar o recurso."),
        404: error_response_docs("Usuário não encontrado."),
    },
)


@router.post(
    "/verify-pin",
    status_code=status.HTTP_200_OK,
    responses={200: {"description": "PIN validado com sucesso e novo token gerado."}},
)
async def verify_pin(
    pin_data: PinVerifyRequest,
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db),
):
    """Valida o PIN administrativo informado.

    Retorna um novo token de acesso JWT contendo a claim 'pin_verified' configurada.

    Args:
        pin_data (PinVerifyRequest): PIN a ser validado.
        current_user (User): Administrador autenticado atual.
        db (AsyncSession): Sessão assíncrona do banco de dados.

    Returns:
        dict: O token de acesso JWT gerado.
    """
    token = await AdminService.verify_pin(db, current_user, pin_data.pin)
    return {"access_token": token, "token_type": "bearer"}


@router.post(
    "/change-pin",
    status_code=status.HTTP_200_OK,
    responses={200: {"description": "PIN alterado com sucesso."}},
)
async def change_pin(
    pin_data: PinChangeRequest,
    current_user: User = Depends(require_admin_pin),
    db: AsyncSession = Depends(get_db),
):
    """Altera o PIN administrativo.

    Exige a validação prévia do PIN ativo.

    Args:
        pin_data (PinChangeRequest): PIN atual e novo PIN.
        current_user (User): Administrador autenticado com PIN validado.
        db (AsyncSession): Sessão assíncrona do banco de dados.

    Returns:
        dict: Mensagem de sucesso.
    """
    await AdminService.change_pin(db, current_user, pin_data.current_pin, pin_data.new_pin)
    return {"message": "PIN alterado com sucesso."}


@router.get("/users", response_model=list[UserResponse], status_code=status.HTTP_200_OK)
async def list_users(
    current_user: User = Depends(require_admin_pin),
    db: AsyncSession = Depends(get_db),
):
    """Lista todos os usuários do sistema.

    Args:
        current_user (User): Administrador autenticado com PIN validado.
        db (AsyncSession): Sessão assíncrona do banco de dados.

    Returns:
        list[User]: Lista de todos os usuários cadastrados.
    """
    return await AdminService.get_all_users(db)


@router.post(
    "/managers",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    responses={201: {"description": "Gerente criado com sucesso."}},
)
async def create_manager(
    manager_data: ManagerCreate,
    current_user: User = Depends(require_admin_pin),
    db: AsyncSession = Depends(get_db),
):
    """Cria uma nova conta de Gerente no sistema.

    Args:
        manager_data (ManagerCreate): Dados do gerente a ser criado.
        current_user (User): Administrador autenticado com PIN validado.
        db (AsyncSession): Sessão assíncrona do banco de dados.

    Returns:
        User: O gerente criado.
    """
    return await AdminService.create_manager(db, manager_data)


@router.patch("/users/{id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def update_user(
    id: int,
    user_data: UserUpdateAdmin,
    current_user: User = Depends(require_admin_pin),
    db: AsyncSession = Depends(get_db),
):
    """Edita dados cadastrais de uma conta de usuário especificada por ID.

    Args:
        id (int): Identificador do usuário.
        user_data (UserUpdateAdmin): Novos dados do usuário.
        current_user (User): Administrador autenticado com PIN validado.
        db (AsyncSession): Sessão assíncrona do banco de dados.

    Returns:
        User: O usuário com os dados atualizados.
    """
    return await AdminService.update_user(db, id, user_data)


@router.delete("/users/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    id: int,
    current_user: User = Depends(require_admin_pin),
    db: AsyncSession = Depends(get_db),
):
    """Exclui fisicamente um usuário do sistema.

    Se houver registros vinculados (chamados, históricos, comentários), o backend
    reatribui esses registros para a conta sentinela "000000000" antes da deleção.
    Se for um técnico, os chamados a ele atribuídos passam para o estado desatribuído (NULL).

    Args:
        id (int): Identificador do usuário.
        current_user (User): Administrador autenticado com PIN validado.
        db (AsyncSession): Sessão assíncrona do banco de dados.

    Returns:
        Response: Corpo vazio com status 204 No Content.
    """
    await AdminService.delete_user(db, id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.patch("/users/{id}/deactivate", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def deactivate_user(
    id: int,
    current_user: User = Depends(require_admin_pin),
    db: AsyncSession = Depends(get_db),
):
    """Desativa uma conta de usuário (muda o campo ativo para False).

    Args:
        id (int): Identificador do usuário.
        current_user (User): Administrador autenticado com PIN validado.
        db (AsyncSession): Sessão assíncrona do banco de dados.

    Returns:
        User: O usuário desativado.
    """
    return await AdminService.deactivate_user(db, id)
