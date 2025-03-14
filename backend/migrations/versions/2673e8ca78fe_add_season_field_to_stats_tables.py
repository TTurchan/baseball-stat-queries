"""Add season field to stats tables

Revision ID: 2673e8ca78fe
Revises: 
Create Date: 2024-03-13 20:35:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2673e8ca78fe'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add season column with default value 2024
    op.add_column('batting_stats', sa.Column('season', sa.Integer(), nullable=True))
    op.execute('UPDATE batting_stats SET season = 2024')
    op.alter_column('batting_stats', 'season', nullable=False)

    op.add_column('pitching_stats', sa.Column('season', sa.Integer(), nullable=True))
    op.execute('UPDATE pitching_stats SET season = 2024')
    op.alter_column('pitching_stats', 'season', nullable=False)


def downgrade():
    op.drop_column('batting_stats', 'season')
    op.drop_column('pitching_stats', 'season')
