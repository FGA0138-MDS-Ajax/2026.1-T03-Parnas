"""2026_06_26_limitar_tentativas_senha_e_pin

Revision ID: a05b8d5941a8
Revises: 9408f477cff6
Create Date: 2026-06-26 19:24:39.080853

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a05b8d5941a8'
down_revision: Union[str, Sequence[str], None] = '9408f477cff6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('failed_login_attempts', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('users', sa.Column('login_blocked_until', sa.DateTime(timezone=True), nullable=True))
    op.add_column('users', sa.Column('failed_pin_attempts', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('users', sa.Column('pin_blocked_until', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'pin_blocked_until')
    op.drop_column('users', 'failed_pin_attempts')
    op.drop_column('users', 'login_blocked_until')
    op.drop_column('users', 'failed_login_attempts')
