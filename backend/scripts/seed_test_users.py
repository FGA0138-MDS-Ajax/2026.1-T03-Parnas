import asyncio
import sys
from pathlib import Path

from sqlalchemy import select

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.database import AsyncSessionLocal, engine
from app.core.security import get_password_hash
from app.models.user import User, UserRole


TEST_USERS = [
    {
        "matricula": "900000001",
        "nome": "Solicitante Teste",
        "email": "solicitante.teste@unb.br",
        "role": UserRole.SOLICITANTE,
    },
    {
        "matricula": "900000002",
        "nome": "Gerente Teste",
        "email": "gerente.teste@unb.br",
        "role": UserRole.GERENTE,
    },
    {
        "matricula": "900000003",
        "nome": "Tecnico Teste",
        "email": "tecnico.teste@unb.br",
        "role": UserRole.TECNICO,
    },
    {
        "matricula": "900000004",
        "nome": "Admin Teste",
        "email": "admin.teste@unb.br",
        "role": UserRole.ADMIN,
    },
]

TEST_PASSWORD = "123"


async def upsert_test_user(user_data: dict[str, object]) -> str:
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(User).where(User.matricula == user_data["matricula"])
        )
        user = result.scalars().first()
        password_hash = get_password_hash(TEST_PASSWORD)

        if user:
            user.nome = user_data["nome"]
            user.email = user_data["email"]
            user.senha_hash = password_hash
            user.role = user_data["role"]
            user.ativo = True
            action = "atualizado"
        else:
            user = User(
                matricula=user_data["matricula"],
                nome=user_data["nome"],
                email=user_data["email"],
                senha_hash=password_hash,
                role=user_data["role"],
                ativo=True,
            )
            session.add(user)
            action = "criado"

        await session.commit()
        return action


async def main() -> None:
    print("Criando contas de teste do KeepUnB...")
    try:
        for user_data in TEST_USERS:
            action = await upsert_test_user(user_data)
            print(
                f"- {user_data['role'].value}: {user_data['email']} "
                f"(senha: {TEST_PASSWORD}) - {action}"
            )
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
