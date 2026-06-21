"""alterar_fk_tecnico_on_delete_set_null

Revision ID: d577b3cc1fea
Revises: bdd7786a1023
Create Date: 2026-06-21 21:38:50.000027

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd577b3cc1fea'
down_revision: Union[str, Sequence[str], None] = 'bdd7786a1023'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint('fk_tickets_tecnico_users', 'tickets', type_='foreignkey')
    op.create_foreign_key(
        'fk_tickets_tecnico_users',
        'tickets',
        'users',
        ['tecnico_id'],
        ['matricula'],
        ondelete='SET NULL'
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('fk_tickets_tecnico_users', 'tickets', type_='foreignkey')
    op.create_foreign_key(
        'fk_tickets_tecnico_users',
        'tickets',
        'users',
        ['tecnico_id'],
        ['matricula']
    )
