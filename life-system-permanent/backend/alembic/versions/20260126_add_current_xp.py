"""add current_xp to player_stats

Revision ID: add_current_xp_001
Revises: 
Create Date: 2026-01-26 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_current_xp_001'
down_revision = '274616c98a4f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Adiciona a coluna current_xp na tabela player_stats
    op.add_column('player_stats', sa.Column('current_xp', sa.Integer(), nullable=True, server_default='0'))
    # Opcional: Se você quiser garantir que não seja nulo depois
    # op.alter_column('player_stats', 'current_xp', nullable=False)


def downgrade() -> None:
    # Remove a coluna caso precisemos voltar atrás
    op.drop_column('player_stats', 'current_xp')