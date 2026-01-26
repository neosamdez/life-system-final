"""add quest details and audit

Revision ID: add_quest_details_001
Revises: add_stats_columns_001
Create Date: 2026-01-26 11:45:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_quest_details_001'
down_revision = 'add_stats_columns_001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add columns to quests
    # op.add_column('quests', sa.Column('is_completed', sa.Boolean(), server_default='false', nullable=True))
    # op.add_column('quests', sa.Column('due_date', sa.DateTime(), nullable=True))
    # op.add_column('quests', sa.Column('completed_at', sa.DateTime(), nullable=True))
    # op.add_column('quests', sa.Column('status', sa.String(), server_default='available', nullable=True))
    
    # Add columns to player_stats
    # op.add_column('player_stats', sa.Column('quests_completed', sa.Integer(), server_default='0', nullable=True))


def downgrade() -> None:
    # Remove columns
    op.drop_column('player_stats', 'quests_completed')
    op.drop_column('quests', 'status')
    # op.drop_column('quests', 'completed_at')
    # op.drop_column('quests', 'due_date')
    # op.drop_column('quests', 'is_completed')
