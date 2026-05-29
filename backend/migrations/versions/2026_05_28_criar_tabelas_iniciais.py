"""2026_05_28_criar_tabelas_iniciais

Revision ID: 436396b251fa
Revises: 
Create Date: 2026-05-29 01:57:00.504008

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '436396b251fa'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Garante que os tipos antigos não conflitem droppando-os se já existirem
    op.execute("DROP TYPE IF EXISTS userrole CASCADE;")
    op.execute("DROP TYPE IF EXISTS ticketstatus CASCADE;")

    # Criação do ENUM de UserRole
    user_role_enum = postgresql.ENUM('SOLICITANTE', 'GERENTE', 'TECNICO', 'ADMIN', name='userrole')
    user_role_enum.create(op.get_bind(), checkfirst=True)

    # Criação da tabela 'users'
    op.create_table(
        'users',
        sa.Column('matricula', sa.String(length=9), nullable=False),
        sa.Column('nome', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=False),
        sa.Column('senha_hash', sa.String(length=255), nullable=False),
        sa.Column('role', postgresql.ENUM('SOLICITANTE', 'GERENTE', 'TECNICO', 'ADMIN', name='userrole', create_type=False), nullable=False, server_default='SOLICITANTE'),
        sa.Column('ativo', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('matricula'),
        sa.CheckConstraint("matricula ~ '^[0-9]{9}$'", name='ck_users_matricula_9_digitos')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_matricula'), 'users', ['matricula'], unique=False)

    # Criação do ENUM de TicketStatus
    ticket_status_enum = postgresql.ENUM('ABERTO', 'ATRIBUIDO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'NAO_INICIADO', name='ticketstatus')
    ticket_status_enum.create(op.get_bind(), checkfirst=True)

    # Criação da tabela 'tickets'
    op.create_table(
        'tickets',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('local', sa.String(length=200), nullable=False),
        sa.Column('tipo_manutencao', sa.String(length=100), nullable=False),
        sa.Column('descricao', sa.Text(), nullable=False),
        sa.Column('status', postgresql.ENUM('ABERTO', 'ATRIBUIDO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'NAO_INICIADO', name='ticketstatus', create_type=False), nullable=False, server_default='ABERTO'),
        sa.Column('solicitante_id', sa.String(length=9), nullable=False),
        sa.Column('tecnico_id', sa.String(length=9), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['solicitante_id'], ['users.matricula'], name='fk_tickets_solicitante_users'),
        sa.ForeignKeyConstraint(['tecnico_id'], ['users.matricula'], name='fk_tickets_tecnico_users'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tickets_id'), 'tickets', ['id'], unique=False)


def downgrade() -> None:
    # Remoção dos índices e tabelas
    op.drop_index(op.f('ix_tickets_id'), table_name='tickets')
    op.drop_table('tickets')
    
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_matricula'), table_name='users')
    op.drop_table('users')

    # Remoção dos ENUMs do PostgreSQL
    postgresql.ENUM(name='userrole').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM(name='ticketstatus').drop(op.get_bind(), checkfirst=True)
