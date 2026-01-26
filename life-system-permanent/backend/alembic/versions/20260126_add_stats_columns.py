"""add stats columns to player_stats

Revision ID: add_stats_columns_001
Revises: add_quest_attr_001
Create Date: 2026-01-26 11:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_stats_columns_001'
down_revision = 'add_quest_attr_001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add columns to player_stats
    op.add_column('player_stats', sa.Column('hp', sa.Integer(), server_default='100', nullable=True))
    op.add_column('player_stats', sa.Column('strength', sa.Integer(), server_default='1', nullable=True))
    op.add_column('player_stats', sa.Column('intelligence', sa.Integer(), server_default='1', nullable=True))
    op.add_column('player_stats', sa.Column('focus', sa.Integer(), server_default='1', nullable=True))


def downgrade() -> None:
    # Remove columns
    op.drop_column('player_stats', 'focus')
    op.drop_column('player_stats', 'intelligence')
    op.drop_column('player_stats', 'strength')
    op.drop_column('player_stats', 'hp')
