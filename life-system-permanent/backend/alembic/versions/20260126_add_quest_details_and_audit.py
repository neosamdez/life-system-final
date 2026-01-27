"""add quest details and audit

Revision ID: add_quest_details_001
Revises: add_stats_columns_001
Create Date: 2026-01-26 11:45:00.000000

"""
from alembic import op
import sqlalchemy as sa


# --- AQUI ESTAVA O PROBLEMA: AS VARIÁVEIS SUMIRAM ---
revision = 'add_quest_details_001'
down_revision = 'add_stats_columns_001'
branch_labels = None
depends_on = None
# ----------------------------------------------------


def upgrade() -> None:
    # Colunas já existem no banco, então não fazemos nada (pass)
    pass


def downgrade() -> None:
    # Downgrade vazio também
    pass