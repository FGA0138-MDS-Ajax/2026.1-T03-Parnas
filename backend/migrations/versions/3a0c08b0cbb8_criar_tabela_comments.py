"""criar_tabela_comments

Revision ID: 3a0c08b0cbb8
Revises: 7b8c9d0e1f2a
"""
from alembic import op
import sqlalchemy as sa

# Identificadores da revisão usados pelo Alembic
revision = '3a0c08b0cbb8'
down_revision = '7b8c9d0e1f2a'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'comments',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('mensagem', sa.Text(), nullable=False),
        sa.Column('ocultado', sa.Boolean(), nullable=False, default=False),
        sa.Column('user_id', sa.String(9), sa.ForeignKey('users.matricula'), nullable=False),
        sa.Column('ticket_id', sa.Integer(), sa.ForeignKey('tickets.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False)
    )

def downgrade():
    op.drop_table('comments')