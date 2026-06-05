"""2026_06_05_criar_tabela_ticket_histories

Revision ID: 405d13014d28
Revises: fb78e0c45afe
Create Date: 2026-06-05 15:21:04.341770

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '405d13014d28'
down_revision: Union[str, Sequence[str], None] = '436396b251fa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Criação da tabela 'ticket_histories'
    op.create_table(
        'ticket_histories',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('ticket_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(length=9), nullable=False),
        sa.Column('action', sa.String(length=100), nullable=False),
        sa.Column(
            'previous_status',
            postgresql.ENUM('ABERTO', 'ATRIBUIDO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'NAO_INICIADO', name='ticketstatus', create_type=False),
            nullable=True
        ),
        sa.Column(
            'new_status',
            postgresql.ENUM('ABERTO', 'ATRIBUIDO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'NAO_INICIADO', name='ticketstatus', create_type=False),
            nullable=True
        ),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['ticket_id'], ['tickets.id'], name='fk_ticket_histories_tickets'),
        sa.ForeignKeyConstraint(['user_id'], ['users.matricula'], name='fk_ticket_histories_users'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ticket_histories_id'), 'ticket_histories', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_ticket_histories_id'), table_name='ticket_histories')
    op.drop_table('ticket_histories')

