# Pietro, 31 de Maio

# O models serve para estruturar a tabela por através de classes Python

import enum
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, Enum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.core.database import Base

class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )

    user_id: Mapped[str] = mapped_column(
        String(9), ForeignKey("users.matricula"), nullable = False
    )

    ticket_id: Mapped[str] = mapped_column(
        String(9), ForeignKey("tickets.id"), nullable = False
    )

    mensagem: Mapped[str] = mapped_column(Text, nullable = False)

    ocultado: Mapped[bool] = mapped_column(bool, nullable = False)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),nullable = False
    )
