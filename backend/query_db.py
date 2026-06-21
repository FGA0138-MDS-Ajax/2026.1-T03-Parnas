import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import text

async def main():
    engine = create_async_engine('postgresql+asyncpg://keepunb:changeme@localhost:5432/keepunb_dev')
    async with AsyncSession(engine) as session:
        result = await session.execute(text('SELECT id, local, tipo_manutencao, status, solicitante_id FROM tickets'))
        print(result.fetchall())

asyncio.run(main())
