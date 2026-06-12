import pytest
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole, ApprovalStatus
from app.services.auth_service import AuthService
from app.schemas.auth import LoginRequest

@pytest.mark.asyncio
async def test_authenticate_user_success(db_session: AsyncSession, create_test_user):
    """Garante que a autenticação de um usuário ativo com credenciais corretas funciona e gera token."""
    # Cria usuário com senha padrão
    user = await create_test_user(
        matricula="123456789",
        nome="João da Silva",
        email="joao@teste.com",
        senha="senha_valida_123",
        role=UserRole.SOLICITANTE,
        ativo=True
    )

    login_data = LoginRequest(email="joao@teste.com", senha="senha_valida_123")
    
    response = await AuthService.authenticate_user(db_session, login_data)
    
    assert response.token_type == "bearer"
    assert response.access_token is not None

@pytest.mark.asyncio
async def test_authenticate_user_email_not_found(db_session: AsyncSession):
    """Garante que a tentativa de login com email inexistente falha com 401."""
    login_data = LoginRequest(email="inexistente@teste.com", senha="senha123")
    
    with pytest.raises(HTTPException) as exc_info:
        await AuthService.authenticate_user(db_session, login_data)
        
    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert exc_info.value.detail == "Email ou senha incorretos."

@pytest.mark.asyncio
async def test_authenticate_user_incorrect_password(db_session: AsyncSession, create_test_user):
    """Garante que o login com senha errada falha com 401."""
    await create_test_user(
        matricula="123456789",
        nome="João da Silva",
        email="joao@teste.com",
        senha="senha_correta",
        role=UserRole.SOLICITANTE,
        ativo=True
    )

    login_data = LoginRequest(email="joao@teste.com", senha="senha_errada")
    
    with pytest.raises(HTTPException) as exc_info:
        await AuthService.authenticate_user(db_session, login_data)
        
    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert exc_info.value.detail == "Email ou senha incorretos."

@pytest.mark.asyncio
async def test_authenticate_user_inactive(db_session: AsyncSession, create_test_user):
    """Garante que o login de um usuário inativo falha com 400."""
    await create_test_user(
        matricula="123456789",
        nome="João da Silva",
        email="joao@teste.com",
        senha="senha_valida",
        role=UserRole.SOLICITANTE,
        ativo=False
    )

    login_data = LoginRequest(email="joao@teste.com", senha="senha_valida")
    
    with pytest.raises(HTTPException) as exc_info:
        await AuthService.authenticate_user(db_session, login_data)
        
    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert exc_info.value.detail == "Usuário inativo."

@pytest.mark.asyncio
async def test_authenticate_tecnico_pendente(db_session: AsyncSession, create_test_user):
    """Garante que um técnico com status PENDENTE não consegue fazer login e recebe 403."""
    await create_test_user(
        matricula="900000001",
        nome="Técnico Pendente",
        email="pendente@teste.com",
        senha="senha123",
        role=UserRole.TECNICO,
        ativo=False,
        approval_status=ApprovalStatus.PENDENTE
    )

    login_data = LoginRequest(email="pendente@teste.com", senha="senha123")

    with pytest.raises(HTTPException) as exc_info:
        await AuthService.authenticate_user(db_session, login_data)

    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert "em análise" in exc_info.value.detail

@pytest.mark.asyncio
async def test_authenticate_tecnico_reprovado(db_session: AsyncSession, create_test_user):
    """Garante que um técnico com status REPROVADO não consegue fazer login e recebe 403."""
    await create_test_user(
        matricula="900000002",
        nome="Técnico Reprovado",
        email="reprovado@teste.com",
        senha="senha123",
        role=UserRole.TECNICO,
        ativo=False,
        approval_status=ApprovalStatus.REPROVADO
    )

    login_data = LoginRequest(email="reprovado@teste.com", senha="senha123")

    with pytest.raises(HTTPException) as exc_info:
        await AuthService.authenticate_user(db_session, login_data)

    assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
    assert "reprovado" in exc_info.value.detail
