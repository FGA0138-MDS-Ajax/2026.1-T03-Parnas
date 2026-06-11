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

from sqlalchemy import select, text

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.database import AsyncSessionLocal, engine
from app.core.security import get_password_hash
from app.models.user import User, UserRole, ApprovalStatus
from app.models.ticket import Ticket, TicketStatus
from app.models.ticket_history import TicketHistory

TEST_USERS = [
    {
        "matricula": "242012345",
        "nome": "Ana Beatriz",
        "email": "ana.beatriz@unb.br",
        "role": UserRole.SOLICITANTE,
    },
    {
        "matricula": "251087284",
        "nome": "César Dantas",
        "email": "cesar.dantas@unb.br",
        "role": UserRole.SOLICITANTE,
    },
    {
        "matricula": "242099873",
        "nome": "Elaine Fagundes",
        "email": "elaine.fagundes@unb.br",
        "role": UserRole.SOLICITANTE,
    },
    {
        "matricula": "171073654",
        "nome": "Gerson Heron",
        "email": "gerson.heron@unb.br",
        "role": UserRole.TECNICO,
    },
    {
        "matricula": "192034342",
        "nome": "Italo Javier",
        "email": "italo.javier@unb.br",
        "role": UserRole.TECNICO,
    },
    {
        "matricula": "152099878",
        "nome": "Kayla Lisa",
        "email": "kayla.lisa@unb.br",
        "role": UserRole.GERENTE,
    },
    {
        "matricula": "201056567",
        "nome": "Marcos Natan",
        "email": "marcos.natan@unb.br",
        "role": UserRole.ADMIN,
    },

    {
        "matricula": "900000005",
        "nome": "Tecnico Pendente",
        "email": "tecnico.pendente@unb.br",
        "role": UserRole.TECNICO,
        "ativo": False,
        "approval_status": ApprovalStatus.PENDENTE,
    },

    {
        "matricula": "900000006",
        "nome": "Tecnico Reprovado",
        "email": "tecnico.rejeitado@unb.br",
        "role": UserRole.TECNICO,
        "ativo": False,
        "approval_status": ApprovalStatus.REPROVADO,
    },
]

TEST_PASSWORD = "123"

TEST_TICKETS = [
    {
        "local": "UED",
        "descricao": "Buraco na parede.",
        "tipo_manutencao": "Estrutural",
        "solicitante_id": "242012345",
        "historico": {}
    },
    {
        "local": "UAC",
        "descricao": "Ninho de pássaro no teto.",
        "tipo_manutencao": "Estrutural",
        "solicitante_id": "251087284",
        "historico": {
            "1":{
                "previous_status": TicketStatus.ABERTO,
                "new_status": TicketStatus.ATRIBUIDO,
                "action": "Atribuído à um técnico.",
                "user_id": "152099878",
                "tecnico_id": "171073654",
            }
        }
    },
    {
        "local": "LDTEA",
        "descricao": "Lâmpada queimada.",
        "tipo_manutencao": "Energia",
        "solicitante_id": "242099873",
        "historico": {
            "1":{
                "previous_status": TicketStatus.ABERTO,
                "new_status": TicketStatus.ATRIBUIDO,
                "action": "Atribuído à um técnico.",
                "user_id": "152099878",
                "tecnico_id": "171073654",
            },
            "2":{
                "previous_status": TicketStatus.ATRIBUIDO,
                "new_status": TicketStatus.EM_ANDAMENTO,
                "action": "Técnico está trabalhando no problema.",
                "user_id": "152099878",
            }
        }
    },
    {
        "local": "RU",
        "descricao": "Torneira sem pressão.",
        "tipo_manutencao": "Hidráulico",
        "solicitante_id": "242099873",
        "historico": {
            "1":{
                "previous_status": TicketStatus.ABERTO,
                "new_status": TicketStatus.ATRIBUIDO,
                "action": "Atribuído à um técnico.",
                "user_id": "152099878",
                "tecnico_id": "192034342",
            },
            "2":{
                "previous_status": TicketStatus.ATRIBUIDO,
                "new_status": TicketStatus.EM_ANDAMENTO,
                "action": "Técnico está trabalhando no problema.",
                "user_id": "152099878",
            },
            "3":{
                "previous_status": TicketStatus.EM_ANDAMENTO,
                "new_status": TicketStatus.CONCLUIDO,
                "action": "Problema resolvido!",
                "user_id": "152099878",
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
            if tecid:
                # atribuir tecnico
                tikid = ticket.id
                session.execute(text("UPDATE tickets SET tecnico_id = tecid WHERE id = tikid;"))

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

        if user:
            user.nome = user_data["nome"]
            user.email = user_data["email"]
            user.senha_hash = password_hash
            user.role = user_data["role"]
            user.ativo = user_data.get("ativo", True)
            user.approval_status = user_data.get("approval_status", ApprovalStatus.APROVADO)
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
