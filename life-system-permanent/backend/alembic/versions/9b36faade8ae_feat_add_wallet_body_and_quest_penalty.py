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
    """Upgrade schema with RAW SQL checks."""
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    existing_tables = inspector.get_table_names()

    # --- LÓGICA MANUAL PARA ENUMS (A MARRETA) ---
    # Verifica diretamente na tabela interna do Postgres se o tipo existe
    # Isso ignora qualquer "cache" ou "inteligência" do SQLAlchemy que esteja falhando
    
    # 1. Financetypeenum
    has_finance_enum = bind.execute(
        sa.text("SELECT 1 FROM pg_type WHERE typname = 'financetypeenum'")
    ).scalar()
    
    if not has_finance_enum:
        # Se não existe, cria na força bruta via SQL
        bind.execute(sa.text("CREATE TYPE financetypeenum AS ENUM ('INCOME', 'EXPENSE')"))

    # 2. Questcategoryenum
    has_quest_enum = bind.execute(
        sa.text("SELECT 1 FROM pg_type WHERE typname = 'questcategoryenum'")
    ).scalar()
    
    if not has_quest_enum:
        bind.execute(sa.text("CREATE TYPE questcategoryenum AS ENUM ('DAILY', 'STORY', 'SIDE_QUEST')"))

    # Define os objetos Enum com create_type=False para usar nas tabelas
    # O create_type=False garante que o create_table NÃO tente criar o tipo de novo
    finance_enum_obj = sa.Enum('INCOME', 'EXPENSE', name='financetypeenum', create_type=False)
    quest_enum_obj = sa.Enum('DAILY', 'STORY', 'SIDE_QUEST', name='questcategoryenum', create_type=False)
    # ---------------------------------------------

    # 1. Update Quests Table
    if 'quests' in existing_tables:
        existing_columns = [c['name'] for c in inspector.get_columns('quests')]
        
        if 'penalty_hp' not in existing_columns:
            op.add_column('quests', sa.Column('penalty_hp', sa.Integer(), nullable=True, server_default='0'))
        
        if 'category' not in existing_columns:
            op.add_column('quests', sa.Column('category', quest_enum_obj, nullable=True, server_default='SIDE_QUEST'))

        if 'is_healing' not in existing_columns:
            op.add_column('quests', sa.Column('is_healing', sa.Boolean(), nullable=True, server_default='false'))

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
        op.create_table('finance_transactions',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('user_id', sa.Integer(), nullable=False),
            # Aqui passamos o objeto com create_type=False
            sa.Column('type', finance_enum_obj, nullable=False),
            sa.Column('amount', sa.Float(), nullable=False),
            sa.Column('category', sa.String(length=100), nullable=False),
            sa.Column('description', sa.String(length=255), nullable=True),
            sa.Column('date', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
            sa.Column('is_fixed', sa.Boolean(), nullable=True),
            sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
            sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index(op.f('ix_finance_transactions_id'), 'finance_transactions', ['id'], unique=False)


def downgrade() -> None:
    # Downgrade simplificado para evitar conflitos de tipos
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    existing_tables = inspector.get_table_names()

    if 'finance_transactions' in existing_tables:
        op.drop_table('finance_transactions')

    if 'body_metrics' in existing_tables:
        op.drop_table('body_metrics')

    if 'quests' in existing_tables:
        existing_columns = [c['name'] for c in inspector.get_columns('quests')]
        if 'penalty_hp' in existing_columns:
            op.drop_column('quests', 'penalty_hp')
        if 'category' in existing_columns:
            op.drop_column('quests', 'category')
        if 'is_healing' in existing_columns:
            op.drop_column('quests', 'is_healing')