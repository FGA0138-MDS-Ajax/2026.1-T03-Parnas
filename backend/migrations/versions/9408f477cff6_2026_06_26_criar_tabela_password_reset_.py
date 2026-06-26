"""2026_06_26_criar_tabela_password_reset_codes

Revision ID: 9408f477cff6
Revises: 897327d751b5
Create Date: 2026-06-26 18:11:24.983357

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9408f477cff6'
down_revision: Union[str, Sequence[str], None] = '897327d751b5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'password_reset_codes',
        sa.Column('id', sa.Integer(), sa.Identity(always=True), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=False),
        sa.Column('code', sa.String(length=6), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_used', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_password_reset_codes_email'), 'password_reset_codes', ['email'], unique=False)
    op.create_index(op.f('ix_password_reset_codes_id'), 'password_reset_codes', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_password_reset_codes_id'), table_name='password_reset_codes')
    op.drop_index(op.f('ix_password_reset_codes_email'), table_name='password_reset_codes')
    op.drop_table('password_reset_codes')
