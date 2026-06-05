from sqlalchemy import DateTime, ForeignKey, Integer, String, Enum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.core.database import Base
from app.models.ticket import TicketStatus


class TicketHistory(Base):
    __tablename__ = "ticket_histories"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )

    ticket_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("tickets.id", name="fk_ticket_histories_tickets"), nullable=False
    )

    user_id: Mapped[str] = mapped_column(
        String(9), ForeignKey("users.matricula", name="fk_ticket_histories_users"), nullable=False
    )

    action: Mapped[str] = mapped_column(String(100), nullable=False)

    previous_status: Mapped[TicketStatus | None] = mapped_column(
        Enum(TicketStatus), nullable=True
    )

    new_status: Mapped[TicketStatus | None] = mapped_column(
        Enum(TicketStatus), nullable=True
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
