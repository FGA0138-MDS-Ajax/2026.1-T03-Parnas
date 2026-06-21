"""adicionar_campo_pin_admin

Revision ID: bdd7786a1023
Revises: 3a0c08b0cbb8
Create Date: 2026-06-21 20:31:22.215126

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bdd7786a1023'
down_revision: Union[str, Sequence[str], None] = '3a0c08b0cbb8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('admin_pin_hash', sa.String(length=255), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'admin_pin_hash')
