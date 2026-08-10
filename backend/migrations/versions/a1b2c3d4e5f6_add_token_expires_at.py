"""add expires_at to token, purge stale rows

Revision ID: a1b2c3d4e5f6
Revises: 87541009c2ee
Create Date: 2026-08-10 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '87541009c2ee'
branch_labels = None
depends_on = None


def upgrade():
    # Existing rows predate expiry tracking and have no reliable issue time,
    # so they're purged rather than backfilled; new tokens always set expires_at.
    op.execute('DELETE FROM token')

    with op.batch_alter_table('token', schema=None) as batch_op:
        batch_op.add_column(sa.Column('expires_at', sa.DateTime(), nullable=False))
        batch_op.create_index(batch_op.f('ix_token_expires_at'), ['expires_at'], unique=False)


def downgrade():
    with op.batch_alter_table('token', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_token_expires_at'))
        batch_op.drop_column('expires_at')
