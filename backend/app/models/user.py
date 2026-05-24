# user.py — TODO: Implementar modelo SQLAlchemy

from sqlalchemy import Boolean, CheckConstraint, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    __table_args__ = (
        CheckConstraint(
            "matricula ~ '^[0-9]{9}$'", name="ck_users_matricula_9_digitos"
        ),
    )

    matricula: Mapped[str] = mapped_column(
        String(9), primary_key=True, index=True, nullable=False
    )

    nome: Mapped[str] = mapped_column(String(100), nullable=False)

    email: Mapped[str] = mapped_column(
        String(150), unique=True, index=True, nullable=False
    )

    senha_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    ativo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
