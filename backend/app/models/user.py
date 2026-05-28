import enum
from sqlalchemy import Boolean, CheckConstraint, DateTime, String, Enum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.core.database import Base


class UserRole(str, enum.Enum):
    SOLICITANTE = "SOLICITANTE"
    GERENTE = "GERENTE"
    TECNICO = "TECNICO"
    ADMIN = "ADMIN"


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

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), nullable=False, default=UserRole.SOLICITANTE
    )

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
