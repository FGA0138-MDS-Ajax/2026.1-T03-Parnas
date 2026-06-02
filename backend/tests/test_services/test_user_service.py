import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole
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
