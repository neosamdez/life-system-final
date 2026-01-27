"""feat: add wallet body and quest penalty

Revision ID: 9b36faade8ae
Revises: 84d23a297c78
Create Date: 2026-01-27 12:15:07.854756

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector


# revision identifiers, used by Alembic.
revision: str = '9b36faade8ae'
down_revision: Union[str, Sequence[str], None] = '84d23a297c78'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema with fail-safe checks."""
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    existing_tables = inspector.get_table_names()

    # 1. Update Quests Table
    if 'quests' in existing_tables:
        existing_columns = [c['name'] for c in inspector.get_columns('quests')]
        
        if 'penalty_hp' not in existing_columns:
            op.add_column('quests', sa.Column('penalty_hp', sa.Integer(), nullable=True, default=0, comment='HP lost if failed/missed'))
        
        if 'category' not in existing_columns:
            # Create Enum type if not exists (Postgres specific)
            # For simplicity using String or Enum with create_type=False if possible, 
            # but here we define the column.
            # Note: In Postgres, Enums are types. We might need to create the type first.
            quest_category_enum = sa.Enum('DAILY', 'STORY', 'SIDE_QUEST', name='questcategoryenum')
            quest_category_enum.create(bind, checkfirst=True)
            op.add_column('quests', sa.Column('category', quest_category_enum, nullable=True, default='SIDE_QUEST'))

        if 'is_healing' not in existing_columns:
            op.add_column('quests', sa.Column('is_healing', sa.Boolean(), nullable=True, default=False, comment='If True, restores HP on completion'))

    # 2. Create BodyMetric Table
    if 'body_metrics' not in existing_tables:
        op.create_table('body_metrics',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('user_id', sa.Integer(), nullable=False),
            sa.Column('date', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
            sa.Column('weight', sa.Float(), nullable=False),
            sa.Column('muscle_mass', sa.Float(), nullable=True),
            sa.Column('fat_percentage', sa.Float(), nullable=True),
            sa.Column('photo_url', sa.String(length=255), nullable=True),
            sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index(op.f('ix_body_metrics_id'), 'body_metrics', ['id'], unique=False)

    # 3. Create FinanceTransaction Table
    if 'finance_transactions' not in existing_tables:
        # Check if we need to create the Enum type
        finance_type_enum = sa.Enum('INCOME', 'EXPENSE', name='financetypeenum')
        finance_type_enum.create(bind, checkfirst=True)

        op.create_table('finance_transactions',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('user_id', sa.Integer(), nullable=False),
            sa.Column('type', finance_type_enum, nullable=False),
            sa.Column('amount', sa.Float(), nullable=False),
            sa.Column('category', sa.String(length=100), nullable=False),
            sa.Column('description', sa.String(length=255), nullable=True),
            sa.Column('date', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
            sa.Column('is_fixed', sa.Boolean(), nullable=True, comment='Recurring monthly bill'),
            sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
            sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index(op.f('ix_finance_transactions_id'), 'finance_transactions', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    existing_tables = inspector.get_table_names()

    if 'finance_transactions' in existing_tables:
        op.drop_index(op.f('ix_finance_transactions_id'), table_name='finance_transactions')
        op.drop_table('finance_transactions')

    if 'body_metrics' in existing_tables:
        op.drop_index(op.f('ix_body_metrics_id'), table_name='body_metrics')
        op.drop_table('body_metrics')

    if 'quests' in existing_tables:
        existing_columns = [c['name'] for c in inspector.get_columns('quests')]
        if 'is_healing' in existing_columns:
            op.drop_column('quests', 'is_healing')
        if 'category' in existing_columns:
            op.drop_column('quests', 'category')
        if 'penalty_hp' in existing_columns:
            op.drop_column('quests', 'penalty_hp')
