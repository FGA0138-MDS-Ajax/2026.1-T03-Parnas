"""2026_06_10_adicionar_photo_path_a_tabela_tickets

Revision ID: 1c12544aae05
Revises: 405d13014d28
Create Date: 2026-06-10 17:58:09.017482

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1c12544aae05'
down_revision: Union[str, Sequence[str], None] = '405d13014d28'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('tickets', sa.Column('photo_path', sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column('tickets', 'photo_path')

