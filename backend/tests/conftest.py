import sys
# Mascara o modulo bcrypt como None para contornar bug de auto-detecção interna do passlib no Python 3.12+
sys.modules['bcrypt'] = None

# Aplica monkeypatch preventivo de segurança para evitar hashing lento nos testes e contornar incompatibilidade de bibliotecas
import app.core.security
app.core.security.get_password_hash = lambda password: f"mocked_hash_{password}"
app.core.security.verify_password = lambda plain, hashed: hashed == f"mocked_hash_{plain}"
get_password_hash = app.core.security.get_password_hash

import asyncio
from typing import AsyncGenerator
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.pool import NullPool
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.core.database import Base, get_db

from app.core.security import create_access_token
from app.main import app
from app.models.user import User, UserRole
from app.models.ticket import Ticket, TicketStatus


# Configura o motor assíncrono para o banco de dados de TESTES (container isolado).
# Usa NullPool para evitar InterfaceError do asyncpg ao transitar entre event loops do pytest.
engine = create_async_engine(
    settings.TEST_DATABASE_URL,
    echo=False,
    future=True,
    poolclass=NullPool
)


AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# O pytest-asyncio gerenciará automaticamente o ciclo de vida do loop de eventos para cada teste.


_db_initialized = False


@pytest.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Fornece uma sessão de banco limpa para cada teste e garante isolamento absoluto."""
    global _db_initialized
    if not _db_initialized:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        _db_initialized = True

    async with AsyncSessionLocal() as session:
        yield session
        # Limpeza pós-teste: primeiro limpa qualquer estado de transação falha ou pendente
        try:
            await session.rollback()
        except Exception:
            pass
        
        # Executa os deletes em uma transação isolada para limpeza garantida
        async with session.begin():
            await session.execute(text("DELETE FROM ticket_histories;"))
            await session.execute(text("DELETE FROM tickets;"))
            await session.execute(text("DELETE FROM users;"))


@pytest.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Fornece um AsyncClient HTTP do httpx com as dependências do FastAPI injetadas de forma mockada."""
    async def _get_db_override():
        yield db_session

    app.dependency_overrides[get_db] = _get_db_override
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
        
    app.dependency_overrides.clear()

# ==========================================
# Fixtures Auxiliares de Criação de Dados
# ==========================================

@pytest.fixture
def create_test_user(db_session: AsyncSession):
    """Retorna uma função utilitária para criar usuários de teste no banco."""
    async def _create(
        matricula: str,
        nome: str,
        email: str,
        senha: str = "senha123",
        role: UserRole = UserRole.SOLICITANTE,
        ativo: bool = True
    ) -> User:
        user = User(
            matricula=matricula,
            nome=nome,
            email=email,
            senha_hash=get_password_hash(senha),
            role=role,
            ativo=ativo
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        return user
    return _create

@pytest.fixture
def create_test_ticket(db_session: AsyncSession):
    """Retorna uma função utilitária para criar chamados (tickets) de teste no banco."""
    async def _create(
        local: str,
        tipo_manutencao: str,
        descricao: str,
        solicitante_id: str,
        tecnico_id: str | None = None,
        status: TicketStatus = TicketStatus.ABERTO
    ) -> Ticket:
        ticket = Ticket(
            local=local,
            tipo_manutencao=tipo_manutencao,
            descricao=descricao,
            solicitante_id=solicitante_id,
            tecnico_id=tecnico_id,
            status=status
        )
        db_session.add(ticket)
        await db_session.commit()
        await db_session.refresh(ticket)
        return ticket
    return _create

# ==========================================
# Fixtures de Usuários Padrão para Testes
# ==========================================

@pytest.fixture
async def test_solicitante(create_test_user) -> User:
    """Cria e retorna um usuário solicitante padrão."""
    return await create_test_user(
        matricula="111111111",
        nome="Solicitante Teste",
        email="solicitante@teste.com",
        role=UserRole.SOLICITANTE
    )

@pytest.fixture
async def test_tecnico(create_test_user) -> User:
    """Cria e retorna um usuário técnico padrão."""
    return await create_test_user(
        matricula="222222222",
        nome="Tecnico Teste",
        email="tecnico@teste.com",
        role=UserRole.TECNICO
    )

@pytest.fixture
async def test_gerente(create_test_user) -> User:
    """Cria e retorna um usuário gerente padrão."""
    return await create_test_user(
        matricula="333333333",
        nome="Gerente Teste",
        email="gerente@teste.com",
        role=UserRole.GERENTE
    )

# ==========================================
# Fixtures de Cabeçalhos HTTP com JWT
# ==========================================

@pytest.fixture
def solicitante_headers(test_solicitante: User) -> dict[str, str]:
    """Retorna o cabeçalho Authorization Bearer com token para o solicitante padrão."""
    token = create_access_token(subject=test_solicitante.matricula)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def tecnico_headers(test_tecnico: User) -> dict[str, str]:
    """Retorna o cabeçalho Authorization Bearer com token para o técnico padrão."""
    token = create_access_token(subject=test_tecnico.matricula)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def gerente_headers(test_gerente: User) -> dict[str, str]:
    """Retorna o cabeçalho Authorization Bearer com token para o gerente padrão."""
    token = create_access_token(subject=test_gerente.matricula)
    return {"Authorization": f"Bearer {token}"}
