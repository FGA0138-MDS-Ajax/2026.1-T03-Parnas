from datetime import datetime
from sqlalchemy import Boolean, DateTime, String, Integer, Identity
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.core.database import Base


class PasswordResetCode(Base):
    __tablename__ = "password_reset_codes"

    id: Mapped[int] = mapped_column(
        Integer, Identity(always=True), primary_key=True, index=True
    )

    email: Mapped[str] = mapped_column(
        String(150), index=True, nullable=False
    )

    code: Mapped[str] = mapped_column(String(6), nullable=False)

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    is_used: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
