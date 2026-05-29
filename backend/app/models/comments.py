import enum
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, Enum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.core.database import Base


#class CommentStatus(str, enum.Enum):
#    # Poderiamos incluir um Enum que indica se o conteúdo do comentário foi moderado.
#    DISPONIVEL = "DISPONIVEL"
#    MODERADO = "MODERADO"


class Comments(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )

    ticket_id: Mapped[str] = mapped_column(
        String(9), ForeignKey("tickets.id"), nullable = False
    )

    user_id: Mapped[str] = mapped_column(
        String(9), ForeignKey("users.matricula"), nullable = False
    )

    mensagem: Mapped[str] = mapped_column(Text, nullable = False)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),nullable = False
    )
