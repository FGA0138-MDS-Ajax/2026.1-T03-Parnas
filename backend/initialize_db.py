#!/usr/bin/env python
"""
Script para inicializar o banco de dados com usuários padrão.
"""

import asyncio
import sys
import os

# Adiciona o diretório do projeto ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings
from app.core.database import Base
from app.models.user import User, UserRole
from app.core.security import get_password_hash


async def init_db():
    """Inicializa o banco de dados com usuários padrão."""
    engine = create_async_engine(settings.DATABASE_URL)
    
    # Cria todas as tabelas
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Cria alguns usuários padrão
    from sqlalchemy.ext.asyncio import AsyncSession
    
    async with AsyncSession(engine) as session:
        # Verifica se os usuários já existem
        from sqlalchemy import select
        result = await session.execute(select(User))
        existing_users = result.scalars().all()
        
        if existing_users:
            print("Usuários já existem no banco de dados. Nenhum usuário padrão será criado.")
            return
        
        # Cria usuários padrão
        default_users = [
            {
                "matricula": "111111111",
                "nome": "Administrador",
                "email": "admin@unb.br",
                "senha": "admin123",
                "role": UserRole.ADMIN
            },
            {
                "matricula": "222222222",
                "nome": "Gerente",
                "email": "gerente@unb.br",
                "senha": "gerente123",
                "role": UserRole.GERENTE
            },
            {
                "matricula": "333333333",
                "nome": "Técnico",
                "email": "tecnico@unb.br",
                "senha": "tecnico123",
                "role": UserRole.TECNICO
            },
            {
                "matricula": "444444444",
                "nome": "Solicitante",
                "email": "solicitante@unb.br",
                "senha": "solicitante123",
                "role": UserRole.SOLICITANTE
            }
        ]
        
        for user_data in default_users:
            user = User(
                matricula=user_data["matricula"],
                nome=user_data["nome"],
                email=user_data["email"],
                senha_hash=get_password_hash(user_data["senha"]),
                role=user_data["role"],
                ativo=True
            )
            session.add(user)
        
        await session.commit()
        print("Usuários padrão criados com sucesso!")


if __name__ == "__main__":
    asyncio.run(init_db())