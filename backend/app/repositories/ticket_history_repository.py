from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.ticket_history import TicketHistory

class TicketHistoryRepository:
    @staticmethod
    async def create_entry(db: AsyncSession, ticket_id: int, user_id: str, action: str) -> TicketHistory:
        history_entry = TicketHistory(
            ticket_id=ticket_id,
            user_id=user_id,
            action=action
        )
        db.add(history_entry)
        await db.commit()
        await db.refresh(history_entry)
        return history_entry

    @staticmethod
    async def get_by_ticket_id(db: AsyncSession, ticket_id: int) -> list[TicketHistory]:
        result = await db.execute(
            select(TicketHistory)
            .where(TicketHistory.ticket_id == ticket_id)
            .order_by(TicketHistory.created_at.asc())
        )
        return list(result.scalars().all())