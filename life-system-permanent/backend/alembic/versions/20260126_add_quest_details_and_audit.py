def upgrade() -> None:
    # Add columns to quests
    # op.add_column('quests', sa.Column('is_completed', sa.Boolean(), server_default='false', nullable=True))
    # op.add_column('quests', sa.Column('due_date', sa.DateTime(), nullable=True))
    # op.add_column('quests', sa.Column('completed_at', sa.DateTime(), nullable=True))
    
    # op.add_column('quests', sa.Column('status', sa.String(), server_default='available', nullable=True))
    
    # Add columns to player_stats
    # op.add_column('player_stats', sa.Column('quests_completed', sa.Integer(), server_default='0', nullable=True))
    
    # A PALAVRA MÁGICA VEM AQUI:
    pass


def downgrade() -> None:
    # Remove columns
    # op.drop_column('player_stats', 'quests_completed')
    # op.drop_column('quests', 'status')
    # op.drop_column('quests', 'completed_at')
    # op.drop_column('quests', 'due_date')
    # op.drop_column('quests', 'is_completed')
    
    # E AQUI TAMBÉM:
    pass