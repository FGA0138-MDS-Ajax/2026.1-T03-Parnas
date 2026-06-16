from fastapi import HTTPException
import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole, ApprovalStatus
from app.services.user_service import UserService

@pytest.mark.asyncio
async def test_get_available_technicians_service(db_session: AsyncSession, create_test_user):
    """Garante que o serviço retorne corretamente a lista de técnicos ativos disponíveis."""
    # Técnico ativo
    tec_ativo = await create_test_user("111111111", "Técnico Ativo", "tec1@teste.com", role=UserRole.TECNICO, ativo=True)
    # Técnico inativo
    await create_test_user("222222222", "Técnico Inativo", "tec2@teste.com", role=UserRole.TECNICO, ativo=False)
    # Solicitante ativo
    await create_test_user("333333333", "Solicitante", "solic@teste.com", role=UserRole.SOLICITANTE, ativo=True)

    technicians = await UserService.get_available_technicians(db_session)
    
    assert len(technicians) == 1
    assert technicians[0].matricula == tec_ativo.matricula
    assert technicians[0].nome == "Técnico Ativo"


@pytest.mark.asyncio
async def test_get_pending_technicians_service(db_session: AsyncSession, create_test_user):
    """Garante que o serviço retorne apenas os técnicos com status PENDENTE."""
    # Técnico pendente
    tec_pendente = await create_test_user(
        "444444444", "Técnico Pendente", "tec_p@teste.com",
        role=UserRole.TECNICO, ativo=False, approval_status=ApprovalStatus.PENDENTE
    )
    # Técnico aprovado
    await create_test_user(
        "555555555", "Técnico Aprovado", "tec_a@teste.com",
        role=UserRole.TECNICO, ativo=True, approval_status=ApprovalStatus.APROVADO
    )
    # Técnico reprovado
    await create_test_user(
        "666666666", "Técnico Reprovado", "tec_r@teste.com",
        role=UserRole.TECNICO, ativo=False, approval_status=ApprovalStatus.REPROVADO
    )

    pending = await UserService.get_pending_technicians(db_session)
    assert len(pending) == 1
    assert pending[0].matricula == tec_pendente.matricula


@pytest.mark.asyncio
async def test_approve_technician_service_success(db_session: AsyncSession, create_test_user):
    """Garante que a aprovação ativa o técnico e atualiza o approval_status."""
    tec = await create_test_user(
        "444444444", "Técnico Pendente", "tec_p@teste.com",
        role=UserRole.TECNICO, ativo=False, approval_status=ApprovalStatus.PENDENTE
    )
    
    updated_user = await UserService.approve_technician(db_session, tec.id)
    assert updated_user.ativo is True
    assert updated_user.approval_status == ApprovalStatus.APROVADO


@pytest.mark.asyncio
async def test_approve_technician_service_not_found(db_session: AsyncSession):
    """Garante erro 404 se o técnico a ser aprovado não existir."""
    with pytest.raises(HTTPException) as exc_info:
        await UserService.approve_technician(db_session, 9999)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Técnico não encontrado."


@pytest.mark.asyncio
async def test_approve_technician_service_invalid_role(db_session: AsyncSession, create_test_user):
    """Garante erro 400 se tentar aprovar um usuário que não é técnico."""
    solic = await create_test_user("333333333", "Solicitante", "solic@teste.com", role=UserRole.SOLICITANTE)
    
    with pytest.raises(HTTPException) as exc_info:
        await UserService.approve_technician(db_session, solic.id)
    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "O usuário informado não é um técnico."


@pytest.mark.asyncio
async def test_reject_technician_service_success(db_session: AsyncSession, create_test_user):
    """Garante que a reprovação mantém/torna o técnico inativo e atualiza o approval_status."""
    tec = await create_test_user(
        "444444444", "Técnico Pendente", "tec_p@teste.com",
        role=UserRole.TECNICO, ativo=False, approval_status=ApprovalStatus.PENDENTE
    )
    
    updated_user = await UserService.reject_technician(db_session, tec.id)
    assert updated_user.ativo is False
    assert updated_user.approval_status == ApprovalStatus.REPROVADO


@pytest.mark.asyncio
async def test_reject_technician_service_not_found(db_session: AsyncSession):
    """Garante erro 404 se o técnico a ser reprovado não existir."""
    with pytest.raises(HTTPException) as exc_info:
        await UserService.reject_technician(db_session, 9999)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Técnico não encontrado."


@pytest.mark.asyncio
async def test_reject_technician_service_invalid_role(db_session: AsyncSession, create_test_user):
    """Garante erro 400 se tentar reprovar um usuário que não é técnico."""
    solic = await create_test_user("333333333", "Solicitante", "solic@teste.com", role=UserRole.SOLICITANTE)
    
    with pytest.raises(HTTPException) as exc_info:
        await UserService.reject_technician(db_session, solic.id)
    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "O usuário informado não é um técnico."
