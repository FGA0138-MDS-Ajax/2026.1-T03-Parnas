"""2026_06_11_adicionar_campos_aprovacao_usuarios

Revision ID: 7b8c9d0e1f2a
Revises: 1c12544aae05
Create Date: 2026-06-11 13:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '7b8c9d0e1f2a'
down_revision: Union[str, Sequence[str], None] = '1c12544aae05'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Criar o tipo ENUM no PostgreSQL
    approvalstatus_enum = postgresql.ENUM(
        'APROVADO', 'REPROVADO', 'PENDENTE',
        name='approvalstatus',
        create_type=False,
    )
    approvalstatus_enum.create(op.get_bind(), checkfirst=True)

    # 2. Adicionar coluna id (sequencial, único)
    op.add_column('users', sa.Column(
        'id', sa.Integer(), sa.Identity(always=True), nullable=False,
    ))
    op.create_index('ix_users_id', 'users', ['id'], unique=True)

    # 3. Adicionar coluna approval_status
    op.add_column('users', sa.Column(
        'approval_status',
        approvalstatus_enum,
        nullable=False,
        server_default='APROVADO',
    ))

    # 4. Adicionar coluna area_manutencao
    op.add_column('users', sa.Column(
        'area_manutencao', sa.String(length=100), nullable=True,
    ))


def downgrade() -> None:
    # 1. Remover colunas na ordem inversa
    op.drop_column('users', 'area_manutencao')
    op.drop_column('users', 'approval_status')

    # 2. Remover index e coluna id
    op.drop_index('ix_users_id', table_name='users')
    op.drop_column('users', 'id')

    # 3. Remover o ENUM do PostgreSQL
    approvalstatus_enum = postgresql.ENUM(
        'APROVADO', 'REPROVADO', 'PENDENTE',
        name='approvalstatus',
    )
    approvalstatus_enum.drop(op.get_bind(), checkfirst=True)
