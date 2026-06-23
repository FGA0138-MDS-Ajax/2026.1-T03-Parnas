"""2026_06_22_alter_ticket_photo_paths

Revision ID: 897327d751b5
Revises: d577b3cc1fea
Create Date: 2026-06-22 13:26:31.330075

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '897327d751b5'
down_revision: Union[str, Sequence[str], None] = 'd577b3cc1fea'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('tickets', sa.Column('photo_paths', sa.JSON(), nullable=True))
    
    # Migrate data
    op.execute(
        "UPDATE tickets "
        "SET photo_paths = json_build_array(photo_path) "
        "WHERE photo_path IS NOT NULL"
    )
    
    op.drop_column('tickets', 'photo_path')


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column('tickets', sa.Column('photo_path', sa.String(length=500), nullable=True))
    
    # Migrate data back
    op.execute(
        "UPDATE tickets "
        "SET photo_path = photo_paths->>0 "
        "WHERE photo_paths IS NOT NULL AND json_array_length(photo_paths) > 0"
    )
    
    op.drop_column('tickets', 'photo_paths')
