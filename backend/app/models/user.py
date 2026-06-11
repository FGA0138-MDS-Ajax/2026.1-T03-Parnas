from enum import unique
import enum
from sqlalchemy import Boolean, CheckConstraint, DateTime, String, Enum, Integer, Identity
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.core.database import Base


class UserRole(str, enum.Enum):
    SOLICITANTE = "SOLICITANTE"
    GERENTE = "GERENTE"
    TECNICO = "TECNICO"
    ADMIN = "ADMIN"

class ApprovalStatus(str, enum.Enum):
    APROVADO = "APROVADO"
    REPROVADO = "REPROVADO"
    PENDENTE = "PENDENTE"

class User(Base):
    __tablename__ = "users"

    __table_args__ = (
        CheckConstraint(
            "matricula ~ '^[0-9]{9}$'", name="ck_users_matricula_9_digitos"
        ),
    )   



    id: Mapped[int] = mapped_column(
        Integer, Identity(always=True), index=True, nullable=False) 

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

    approval_status: Mapped[ApprovalStatus] = mapped_column(
        Enum(ApprovalStatus), nullable=False, default=ApprovalStatus.PENDENTE
    )

    area_manutencao: Mapped[str] = mapped_column(String(100), nullable=True)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
