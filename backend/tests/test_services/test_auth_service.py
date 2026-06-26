import pytest
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole, ApprovalStatus
from app.services.auth_service import AuthService
from app.schemas.auth import LoginRequest, RegisterRequest

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
    assert "Email ou senha incorretos" in exc_info.value.detail

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
    assert "Email ou senha incorretos" in exc_info.value.detail

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


@pytest.mark.asyncio
async def test_register_solicitante_success(db_session: AsyncSession):
    """Garante que o registro de um solicitante com dados válidos funciona."""
    register_data = RegisterRequest(
        matricula="123456789",
        nome="Novo Solicitante",
        email="novosolicitante@teste.com",
        senha="senha_forte_123",
        role=UserRole.SOLICITANTE,
    )
    
    response = await AuthService.register_user(db_session, register_data)
    
    assert response.token_type == "bearer"
    assert response.access_token is not None
    
    # Valida no banco
    from app.repositories.user_repository import UserRepository
    user = await UserRepository.get_by_matricula(db_session, "123456789")
    assert user is not None
    assert user.nome == "Novo Solicitante"
    assert user.role == UserRole.SOLICITANTE
    assert user.ativo is True
    assert user.approval_status == ApprovalStatus.APROVADO


@pytest.mark.asyncio
async def test_register_tecnico_success_with_generated_matricula(db_session: AsyncSession):
    """Garante que o registro de técnico funciona e gera matrícula automaticamente se não informada."""
    register_data = RegisterRequest(
        nome="Novo Tecnico",
        email="novotecnico@teste.com",
        senha="senha_forte_123",
        role=UserRole.TECNICO,
        area_manutencao="Predial",
    )
    
    # Espera-se HTTP 202 com detalhes sobre a aprovação pendente
    with pytest.raises(HTTPException) as exc_info:
        await AuthService.register_user(db_session, register_data)
        
    assert exc_info.value.status_code == status.HTTP_202_ACCEPTED
    assert "Aguarde a aprovação" in exc_info.value.detail

    # Verifica no banco de dados
    from app.repositories.user_repository import UserRepository
    user = await UserRepository.get_by_email(db_session, "novotecnico@teste.com")
    assert user is not None
    assert user.nome == "Novo Tecnico"
    assert user.role == UserRole.TECNICO
    assert user.ativo is False
    assert user.approval_status == ApprovalStatus.PENDENTE
    assert user.area_manutencao == "Predial"
    assert user.matricula is not None
    assert len(user.matricula) == 9
    assert user.matricula.startswith("9")


@pytest.mark.asyncio
async def test_register_user_email_duplicated(db_session: AsyncSession, create_test_user):
    """Garante que o cadastro com e-mail duplicado é bloqueado."""
    await create_test_user(
        matricula="111222333",
        nome="Existente",
        email="duplicado@teste.com",
        senha="senha_correta",
        role=UserRole.SOLICITANTE,
        ativo=True
    )
    
    register_data = RegisterRequest(
        matricula="123456789",
        nome="Novo Solicitante",
        email="duplicado@teste.com",
        senha="senha_forte_123",
        role=UserRole.SOLICITANTE,
    )
    
    with pytest.raises(HTTPException) as exc_info:
        await AuthService.register_user(db_session, register_data)
        
    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert "email já existe" in exc_info.value.detail


@pytest.mark.asyncio
async def test_register_user_matricula_duplicated(db_session: AsyncSession, create_test_user):
    """Garante que o cadastro com matrícula duplicada é bloqueado."""
    await create_test_user(
        matricula="111222333",
        nome="Existente",
        email="existente@teste.com",
        senha="senha_correta",
        role=UserRole.SOLICITANTE,
        ativo=True
    )
    
    register_data = RegisterRequest(
        matricula="111222333",
        nome="Novo Solicitante",
        email="novo@teste.com",
        senha="senha_forte_123",
        role=UserRole.SOLICITANTE,
    )
    
    with pytest.raises(HTTPException) as exc_info:
        await AuthService.register_user(db_session, register_data)
        
    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert "matrícula já existe" in exc_info.value.detail.lower()


@pytest.mark.asyncio
async def test_authenticate_user_remember_me(db_session: AsyncSession, create_test_user):
    """Garante que o login com lembrar_me=True gera um token com expiração estendida de 7 dias."""
    from jose import jwt
    from app.core.config import settings

    await create_test_user(
        matricula="123456789",
        nome="João da Silva",
        email="joao@teste.com",
        senha="senha_valida_123",
        role=UserRole.SOLICITANTE,
        ativo=True
    )

    # 1. Login sem Lembrar-me (padrão de 30 minutos)
    login_normal = LoginRequest(email="joao@teste.com", senha="senha_valida_123", lembrar_me=False)
    resp_normal = await AuthService.authenticate_user(db_session, login_normal)
    payload_normal = jwt.decode(resp_normal.access_token, settings.SECRET_KEY, algorithms=["HS256"])
    exp_normal = payload_normal["exp"]

    # 2. Login com Lembrar-me (estendido para 7 dias)
    login_remember = LoginRequest(email="joao@teste.com", senha="senha_valida_123", lembrar_me=True)
    resp_remember = await AuthService.authenticate_user(db_session, login_remember)
    payload_remember = jwt.decode(resp_remember.access_token, settings.SECRET_KEY, algorithms=["HS256"])
    exp_remember = payload_remember["exp"]

    # A diferença de expiração deve ser de aproximadamente 7 dias (menos os 30 minutos padrão)
    diff = exp_remember - exp_normal
    assert 602000 < diff < 604000


