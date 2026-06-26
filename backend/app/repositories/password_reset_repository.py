from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.password_reset_code import PasswordResetCode

class PasswordResetRepository:
    @staticmethod
    async def create(db: AsyncSession, reset_code: PasswordResetCode) -> PasswordResetCode:
        db.add(reset_code)
        await db.commit()
        await db.refresh(reset_code)
        return reset_code

    @staticmethod
    async def get_active_code(db: AsyncSession, email: str) -> PasswordResetCode | None:
        """
        Retorna o código ativo mais recente para um e-mail.
        Considera ativo se não foi usado e se não expirou.
        """
        now = datetime.now(timezone.utc)
        result = await db.execute(
            select(PasswordResetCode)
            .where(
                PasswordResetCode.email == email,
                PasswordResetCode.is_used == False,
                PasswordResetCode.expires_at > now
            )
            .order_by(PasswordResetCode.created_at.desc())
            .limit(1)
        )
        return result.scalars().first()

    @staticmethod
    async def mark_as_used(db: AsyncSession, reset_code: PasswordResetCode) -> PasswordResetCode:
        reset_code.is_used = True
        db.add(reset_code)
        await db.commit()
        await db.refresh(reset_code)
        return reset_code
