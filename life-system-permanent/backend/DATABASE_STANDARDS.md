# Database Standards & Protocols ("Neo Protocol")

## 1. The "Safe Migration" Boilerplate

All future migrations MUST use the following pattern to prevent `DuplicateColumnError` and ensure idempotency. **Do not blindly use `op.add_column`.**

```python
from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector

def upgrade():
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    
    # Example: Adding 'new_column' to 'users' table
    table_name = 'users'
    column_name = 'new_column'
    
    existing_columns = [c['name'] for c in inspector.get_columns(table_name)]
    
    if column_name not in existing_columns:
        op.add_column(table_name, sa.Column(column_name, sa.String(50)))
    else:
        print(f"Column {column_name} already exists in {table_name}. Skipping.")

def downgrade():
    # Downgrade logic should also be safe if possible, but usually drop_column is fine
    # unless the column doesn't exist.
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    
    table_name = 'users'
    column_name = 'new_column'
    
    existing_columns = [c['name'] for c in inspector.get_columns(table_name)]
    
    if column_name in existing_columns:
        op.drop_column(table_name, column_name)
```

## 2. The Workflow

1.  **Modify `models.py`**: Update your SQLAlchemy models in `backend/app/models/models.py`.
2.  **Generate Migration**: Run `alembic revision --autogenerate -m "description"` (or manual revision).
3.  **MANDATORY Manual Edit**: Open the generated migration file.
    *   **Wrap** every `op.add_column` call in the "Safe Migration" block shown above.
    *   **Verify** imports and logic.
4.  **Apply Migration**: Run `alembic upgrade head`.

## 3. Disaster Recovery

If the database gets into a "Drifted State" (messy schema, sync errors):

1.  **Do NOT** delete the database unless absolutely necessary.
2.  **Run the Synchronizer**: Use the `20260127_sync_db_schema.py` (Revision `84d23a297c78`) logic as a template.
    *   You can create a new "Sync" migration that iterates over all models and adds missing columns.
3.  **Inspect**: Use `sqlalchemy.engine.reflection.Inspector` in a script to list actual columns vs expected columns.

```python
# Quick Inspection Script
from app.core.database import engine
from sqlalchemy import inspect
import asyncio

async def inspect_db():
    async with engine.connect() as conn:
        def sync_inspect(connection):
            inspector = inspect(connection)
            for table_name in inspector.get_table_names():
                print(f"Table: {table_name}")
                for col in inspector.get_columns(table_name):
                    print(f"  - {col['name']} ({col['type']})")
        
        await conn.run_sync(sync_inspect)

if __name__ == "__main__":
    asyncio.run(inspect_db())
```
