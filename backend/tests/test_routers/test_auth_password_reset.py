import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, UserRole, ApprovalStatus
from app.core.security import get_password_hash
from app.repositories.user_repository import UserRepository
from app.repositories.password_reset_repository import PasswordResetRepository
from app.models.password_reset_code import PasswordResetCode
from datetime import datetime, timedelta, timezone


@pytest.mark.asyncio
async def test_forgot_password(client: AsyncClient, test_solicitante: User):
    # Enviar email válido
    response = await client.post(
        "/api/v1/auth/forgot-password",
        json={"email": test_solicitante.email}
    )
    assert response.status_code == 202
    assert "código de recuperação será enviado em breve" in response.json()["message"]

    # Enviar email inválido (deve retornar 202 também por questões de segurança - evitar enumeração)
    response_invalid = await client.post(
        "/api/v1/auth/forgot-password",
        json={"email": "naoexiste@unb.br"}
    )
    assert response_invalid.status_code == 202


@pytest.mark.asyncio
async def test_verify_code(client: AsyncClient, db_session: AsyncSession, test_solicitante: User):
    # Criar um código manual no banco
    code = "123456"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
    reset_code = PasswordResetCode(
        email=test_solicitante.email,
        code=code,
        expires_at=expires_at
    )
    db_session.add(reset_code)
    await db_session.commit()

    # Verificar com código correto
    response = await client.post(
        "/api/v1/auth/verify-code",
        json={"email": test_solicitante.email, "code": code}
    )
    assert response.status_code == 200
    assert "reset_token" in response.json()
    assert response.json()["token_type"] == "bearer"

    # Verificar se o código foi marcado como usado
    await db_session.refresh(reset_code)
    assert reset_code.is_used is True

    # Verificar com código incorreto
    response_invalid = await client.post(
        "/api/v1/auth/verify-code",
        json={"email": test_solicitante.email, "code": "654321"}
    )
    assert response_invalid.status_code == 400

@pytest.mark.asyncio
async def test_reset_password(client: AsyncClient, db_session: AsyncSession, test_solicitante: User):
    # Pegar o token de redefinição
    code = "123456"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
    reset_code = PasswordResetCode(
        email=test_solicitante.email,
        code=code,
        expires_at=expires_at
    )
    db_session.add(reset_code)
    await db_session.commit()

    verify_response = await client.post(
        "/api/v1/auth/verify-code",
        json={"email": test_solicitante.email, "code": code}
    )
    token = verify_response.json()["reset_token"]

    # Usar o token para redefinir a senha
    nova_senha = "nova_senha_segura"
    response = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": token, "nova_senha": nova_senha}
    )
    assert response.status_code == 204

    # Tentar fazer login com a nova senha
    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": test_solicitante.email, "senha": nova_senha}
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()
