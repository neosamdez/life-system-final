"""add attribute_reward to quests

Revision ID: add_quest_attr_001
Revises: add_current_xp_001
Create Date: 2026-01-26 11:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# Identificadores da revisão
revision = 'add_quest_attr_001'

# ATENÇÃO: Aqui conectamos na migration anterior (aquela do XP)
# Se você copiou meu código anterior, o ID era 'add_current_xp_001'
down_revision = 'add_current_xp_001'

branch_labels = None
depends_on = None


def upgrade() -> None:
    # Cria a coluna attribute_reward na tabela quests
    op.add_column('quests', sa.Column('attribute_reward', sa.String(), nullable=True))


def downgrade() -> None:
    # Remove a coluna caso precise voltar
    op.drop_column('quests', 'attribute_reward')