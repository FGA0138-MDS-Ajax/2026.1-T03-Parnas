import pytest
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import ApprovalStatus, User, UserRole
from app.repositories.user_repository import UserRepository

@pytest.mark.asyncio
async def test_create_user_success(db_session: AsyncSession, create_test_user):
    """Garante que um usuário válido pode ser criado com sucesso."""
    user = await create_test_user(
        matricula="123456789",
        nome="João da Silva",
        email="joao@teste.com",
        role=UserRole.SOLICITANTE
    )
    assert user.matricula == "123456789"
    assert user.nome == "João da Silva"
    assert user.email == "joao@teste.com"
    assert user.role == UserRole.SOLICITANTE
    assert user.ativo is True

@pytest.mark.asyncio
async def test_user_matricula_constraint_invalid_length(db_session: AsyncSession, create_test_user):
    """Garante que a check constraint de matrícula impede matrículas com tamanho diferente de 9."""
    # Matrícula menor que 9 dígitos
    async with db_session.begin_nested():
        with pytest.raises(SQLAlchemyError):
            await create_test_user(
                matricula="12345",
                nome="Inválido Menor",
                email="menor@teste.com"
            )

    # Matrícula maior que 9 dígitos
    async with db_session.begin_nested():
        with pytest.raises(SQLAlchemyError):
            await create_test_user(
                matricula="1234567890",
                nome="Inválido Maior",
                email="maior@teste.com"
            )

@pytest.mark.asyncio
async def test_user_matricula_constraint_non_numeric(db_session: AsyncSession, create_test_user):
    """Garante que a check constraint de matrícula impede matrículas que não contenham apenas dígitos."""
    async with db_session.begin_nested():
        with pytest.raises(SQLAlchemyError):
            await create_test_user(
                matricula="12345678a",
                nome="Não Numérico",
                email="nonnum@teste.com"
            )

@pytest.mark.asyncio
async def test_user_email_uniqueness(db_session: AsyncSession, create_test_user):
    """Garante que a unicidade do e-mail é estritamente respeitada."""
    await create_test_user(
        matricula="111111111",
        nome="Primeiro",
        email="duplicado@teste.com"
    )

    async with db_session.begin_nested():
        with pytest.raises(SQLAlchemyError):
            await create_test_user(
                matricula="222222222",
                nome="Segundo",
                email="duplicado@teste.com"
            )



@pytest.mark.asyncio
async def test_get_by_email(db_session: AsyncSession, create_test_user):
    """Garante a busca correta de usuário pelo e-mail através do repositório."""
    user = await create_test_user(
        matricula="123456789",
        nome="Busca Email",
        email="busca@teste.com"
    )

    # Busca usuário existente
    found_user = await UserRepository.get_by_email(db_session, "busca@teste.com")
    assert found_user is not None
    assert found_user.matricula == user.matricula

    # Busca usuário inexistente
    not_found = await UserRepository.get_by_email(db_session, "inexistente@teste.com")
    assert not_found is None

@pytest.mark.asyncio
async def test_get_by_matricula(db_session: AsyncSession, create_test_user):
    """Garante a busca correta de usuário pela matrícula através do repositório."""
    user = await create_test_user(
        matricula="987654321",
        nome="Busca Matrícula",
        email="buscamat@teste.com"
    )

    # Busca usuário existente
    found_user = await UserRepository.get_by_matricula(db_session, "987654321")
    assert found_user is not None
    assert found_user.email == user.email

    # Busca usuário inexistente
    not_found = await UserRepository.get_by_matricula(db_session, "000000000")
    assert not_found is None

@pytest.mark.asyncio
async def test_get_available_technicians(db_session: AsyncSession, create_test_user):
    """Garante que a listagem de técnicos disponíveis retorne apenas técnicos ativos."""
    # 1. Técnico ativo (deve ser retornado)
    tec_ativo = await create_test_user(
        matricula="111111111",
        nome="Técnico Ativo",
        email="tec1@teste.com",
        role=UserRole.TECNICO,
        ativo=True
    )
    # 2. Técnico inativo (não deve ser retornado)
    await create_test_user(
        matricula="222222222",
        nome="Técnico Inativo",
        email="tec2@teste.com",
        role=UserRole.TECNICO,
        ativo=False
    )
    await create_test_user(
        matricula="555555555",
        nome="Técnico Pendente",
        email="tec_pendente@teste.com",
        role=UserRole.TECNICO,
        ativo=True,
        approval_status=ApprovalStatus.PENDENTE
    )
    # 3. Solicitante ativo (não deve ser retornado)
    await create_test_user(
        matricula="333333333",
        nome="Solicitante",
        email="solic@teste.com",
        role=UserRole.SOLICITANTE,
        ativo=True
    )
    # 4. Gerente ativo (não deve ser retornado)
    await create_test_user(
        matricula="444444444",
        nome="Gerente",
        email="gerente@teste.com",
        role=UserRole.GERENTE,
        ativo=True
    )

    technicians = await UserRepository.get_available_technicians(db_session)
    
    assert len(technicians) == 1
    assert technicians[0].matricula == tec_ativo.matricula
    assert technicians[0].nome == "Técnico Ativo"
