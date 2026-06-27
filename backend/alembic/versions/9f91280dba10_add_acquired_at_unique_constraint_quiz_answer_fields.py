"""add acquired_at, unique constraint, quiz answer fields

Revision ID: 9f91280dba10
Revises: dc02abe3fb7d
Create Date: 2026-06-26 23:05:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9f91280dba10'
down_revision: Union[str, Sequence[str], None] = 'dc02abe3fb7d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # server_default обязателен: на проде уже есть строки в user_cards,
    # без него NOT NULL колонка не добавится
    op.add_column(
        'user_cards',
        sa.Column('acquired_at', sa.DateTime(timezone=True),
                  server_default=sa.func.now(), nullable=False),
    )
    op.create_unique_constraint(
        'uq_user_cards_user_id_card_id', 'user_cards', ['user_id', 'card_id']
    )
    op.add_column(
        'quiz_sessions',
        sa.Column('is_correct', sa.Boolean(), nullable=True),
    )
    op.add_column(
        'quiz_sessions',
        sa.Column('selected_option', sa.Integer(), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('quiz_sessions', 'selected_option')
    op.drop_column('quiz_sessions', 'is_correct')
    op.drop_constraint('uq_user_cards_user_id_card_id', 'user_cards', type_='unique')
    op.drop_column('user_cards', 'acquired_at')
