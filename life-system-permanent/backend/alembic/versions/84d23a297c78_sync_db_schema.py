"""sync_db_schema

Revision ID: 84d23a297c78
Revises: add_quest_details_001
Create Date: 2026-01-27 11:20:11.390785

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector
import sys
import os

# Ensure we can import from app
# backend/alembic/versions -> backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.models.models import User, Quest, PlayerStats, FinanceTransaction

# revision identifiers, used by Alembic.
revision: str = '84d23a297c78'
down_revision: Union[str, Sequence[str], None] = 'add_quest_details_001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema with fail-safe synchronization."""
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    
    # List of models to synchronize
    models = [User, Quest, PlayerStats, FinanceTransaction]
    
    existing_tables = inspector.get_table_names()
    
    for model in models:
        table_name = model.__tablename__
        
        if table_name not in existing_tables:
            print(f"Table '{table_name}' does not exist. Skipping column sync for this table.")
            continue
            
        print(f"Checking table: {table_name}")
        existing_columns = [c['name'] for c in inspector.get_columns(table_name)]
        
        for column in model.__table__.columns:
            if column.name not in existing_columns:
                print(f"  Column '{column.name}' missing in '{table_name}'. Adding...")
                # We use column.copy() to ensure we have a fresh instance
                op.add_column(table_name, column.copy())
            else:
                # Column exists, do nothing
                pass

def downgrade() -> None:
    """Downgrade schema."""
    pass
