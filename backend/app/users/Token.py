from sqlalchemy import ForeignKey

from extensions import db

class Token(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    user_id = db.Column(db.Integer, ForeignKey("user.id"), nullable=False, index=True)
    is_active = db.Column(db.Boolean, default=True)