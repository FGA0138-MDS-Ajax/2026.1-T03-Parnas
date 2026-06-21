# Pietro
# 06 de junho
# Inspirado em 'seed_test_users.py'

# Esse script cria
#   3 solicitantes
#   2 técnicos
#   1 técnico pendente
#   1 técnico reprovado
#   1 gerente
#   1 administrador
#   4 tickets
#       1 aberto
#       1 atribuído
#       1 em andamento
#       1 concluído

import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.database import AsyncSessionLocal, engine
from app.core.security import get_password_hash
from app.models.user import User, UserRole, ApprovalStatus
from app.models.ticket import Ticket, TicketStatus
from app.models.ticket_history import TicketHistory

from sqlalchemy import select, text, update

TEST_USERS = [
    {
        "matricula": "100000001",
        "nome": "Solicitante Um",
        "email": "solicitante1@unb.br",
        "role": UserRole.SOLICITANTE,
    },
    {
        "matricula": "100000002",
        "nome": "Solicitante Dois",
        "email": "solicitante2@unb.br",
        "role": UserRole.SOLICITANTE,
    },
    {
        "matricula": "100000003",
        "nome": "Solicitante Tres",
        "email": "solicitante3@unb.br",
        "role": UserRole.SOLICITANTE,
    },
    {
        "matricula": "200000001",
        "nome": "Tecnico Um",
        "email": "tecnico1@unb.br",
        "role": UserRole.TECNICO,
        "area_manutencao": "Estrutural",
    },
    {
        "matricula": "200000002",
        "nome": "Tecnico Dois",
        "email": "tecnico2@unb.br",
        "role": UserRole.TECNICO,
        "area_manutencao": "Hidráulico",
    },
    {
        "matricula": "300000001",
        "nome": "Gerente Um",
        "email": "gerente1@unb.br",
        "role": UserRole.GERENTE,
    },
    {
        "matricula": "300000002",
        "nome": "Gerente Dois",
        "email": "gerente2@unb.br",
        "role": UserRole.GERENTE,
    },
    {
        "matricula": "400000001",
        "nome": "Admin Um",
        "email": "admin1@unb.br",
        "role": UserRole.ADMIN,
    },
    {
        "matricula": "400000002",
        "nome": "Admin Dois",
        "email": "admin2@unb.br",
        "role": UserRole.ADMIN,
    },

    {
        "matricula": "200000003",
        "nome": "Tecnico Pendente",
        "email": "tecnico_pendente@unb.br",
        "role": UserRole.TECNICO,
        "ativo": False,
        "approval_status": ApprovalStatus.PENDENTE,
        "area_manutencao": "Energia",
    },

    {
        "matricula": "200000004",
        "nome": "Tecnico Reprovado",
        "email": "tecnico_reprovado@unb.br",
        "role": UserRole.TECNICO,
        "ativo": False,
        "approval_status": ApprovalStatus.REPROVADO,
        "area_manutencao": "Estrutural",
    },
]

TEST_PASSWORD = "123"

TEST_TICKETS = [
    {
        "local": "UED",
        "descricao": "Buraco na parede.",
        "photo_path": "buracoparede.jpeg",
        "tipo_manutencao": "Estrutural",
        "solicitante_id": "100000001",
        "historico": {}
    },
    {
        "local": "UAC",
        "descricao": "Ninho de pássaro no teto.",
        "photo_path": "semenergia.jpg",
        "tipo_manutencao": "Estrutural",
        "solicitante_id": "100000002",
        "historico": {
            "1":{
                "previous_status": TicketStatus.ABERTO,
                "new_status": TicketStatus.ATRIBUIDO,
                "action": "Atribuído à um técnico.",
                "user_id": "300000001",
                "tecnico_id": "200000001",
            }
        }
    },
    {
        "local": "LDTEA",
        "descricao": "Lâmpada queimada.",
        "photo_path": "lampadaquebrada.webp",
        "tipo_manutencao": "Energia",
        "solicitante_id": "100000003",
        "historico": {
            "1":{
                "previous_status": TicketStatus.ABERTO,
                "new_status": TicketStatus.ATRIBUIDO,
                "action": "Atribuído à um técnico.",
                "user_id": "300000001",
                "tecnico_id": "200000001",
            },
            "2":{
                "previous_status": TicketStatus.ATRIBUIDO,
                "new_status": TicketStatus.EM_ANDAMENTO,
                "action": "Técnico está trabalhando no problema.",
                "user_id": "300000001",
            }
        }
    },
    {
        "local": "RU",
        "descricao": "Torneira sem pressão.",
        "tipo_manutencao": "Hidráulico",
        "solicitante_id": "100000003",
        "historico": {
            "1":{
                "previous_status": TicketStatus.ABERTO,
                "new_status": TicketStatus.ATRIBUIDO,
                "action": "Atribuído à um técnico.",
                "user_id": "300000001",
                "tecnico_id": "200000002",
            },
            "2":{
                "previous_status": TicketStatus.ATRIBUIDO,
                "new_status": TicketStatus.EM_ANDAMENTO,
                "action": "Técnico está trabalhando no problema.",
                "user_id": "300000001",
            },
            "3":{
                "previous_status": TicketStatus.EM_ANDAMENTO,
                "new_status": TicketStatus.CONCLUIDO,
                "action": "Problema resolvido!",
                "user_id": "300000001",
            }
        }
    },
]

async def clear_db():
    async with AsyncSessionLocal() as session:
        try:
            await session.rollback()
        except Exception:
            pass

        await session.execute(text("DELETE FROM ticket_histories;"))
        await session.execute(text("DELETE FROM tickets;"))
        await session.execute(text("DELETE FROM users;"))
        await session.commit()

async def upsert_test_ticket(ticket_data: dict[str, object]) -> str:
    async with AsyncSessionLocal() as session:
        ticket = Ticket(
            local=ticket_data['local'],
            descricao=ticket_data['descricao'],
            tipo_manutencao=ticket_data['tipo_manutencao'],
            solicitante_id=ticket_data['solicitante_id'],
            photo_path=ticket_data.get('photo_path')
        )

        session.add(ticket)

        await session.commit()
        await session.refresh(ticket) # Depois que dá o refresh, o objeto 'ticket' fica com o 'id' setado!!!

        ticket_history = TicketHistory(
            new_status=TicketStatus.ABERTO,
            user_id=ticket_data['solicitante_id'],
            ticket_id=ticket.id,
            action="Ticket criada."
        )
        session.add(ticket_history)

        for k, hist_data in ticket_data['historico'].items():
            print(hist_data)
            tecid = hist_data.get('tecnico_id')
            nusta = hist_data.get('new_status')

            # atribuir tecnico se necessario
            if tecid:
                # coloca o técnico no ticket
                stmt = (
                    update(Ticket)
                    .filter(Ticket.id==ticket.id)
                    .values(tecnico_id=tecid)
                )

                await session.execute(stmt)
                await session.commit()

            # atribuir novo estado de ticket
            stmt= (
                update(Ticket)
                .filter(Ticket.id==ticket.id)
                .values(status=nusta)
            )

            await session.execute(stmt)
            await session.commit()

            ticket_history = TicketHistory(
                previous_status=hist_data['previous_status'],
                new_status=hist_data['new_status'],
                user_id=hist_data['user_id'],
                ticket_id=ticket.id,
                action=hist_data['action']
            )
            session.add(ticket_history)

        await session.commit()

        return "criado"

async def upsert_test_user(user_data: dict[str, object]) -> str:
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(User).where(User.matricula == user_data["matricula"])
        )
        user = result.scalars().first()
        password_hash = get_password_hash(TEST_PASSWORD)

        admin_pin_hash = None
        if user_data["role"] == UserRole.ADMIN:
            admin_pin_hash = get_password_hash("1234")

        if user:
            user.nome = user_data["nome"]
            user.email = user_data["email"]
            user.senha_hash = password_hash
            user.role = user_data["role"]
            user.ativo = user_data.get("ativo", True)
            user.approval_status = user_data.get("approval_status", ApprovalStatus.APROVADO)
            user.area_manutencao = user_data.get("area_manutencao")
            user.admin_pin_hash = admin_pin_hash
            action = "atualizado"
        else:
            user = User(
                matricula=user_data["matricula"],
                nome=user_data["nome"],
                email=user_data["email"],
                senha_hash=password_hash,
                role=user_data["role"],
                ativo=user_data.get("ativo", True),
                approval_status=user_data.get("approval_status", ApprovalStatus.APROVADO),
                area_manutencao=user_data.get("area_manutencao"),
                admin_pin_hash=admin_pin_hash,
            )
            session.add(user)
            action = "criado"

        await session.commit()
        return action


async def main() -> None:
    try:
        print("Esvaziando tabelas do KeepUnB...")
        await clear_db()

        print("Criando contas de teste do KeepUnB...")
        for user_data in TEST_USERS:
            action = await upsert_test_user(user_data)
            print(
                f"- {user_data['role'].value}: {user_data['email']} "
                f"(senha: {TEST_PASSWORD}) - {action}"
            )

        print("Criando tickets de teste do KeepUnB...")
        for ticket_data in TEST_TICKETS:
            action = await upsert_test_ticket(ticket_data)
            print(ticket_data['local']," - ",ticket_data['descricao'])
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
