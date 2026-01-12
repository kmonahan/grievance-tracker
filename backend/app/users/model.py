from sqlalchemy.sql import expression

from extensions import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(250), nullable=False, unique=True)
    password = db.Column(db.String(250), nullable=False)
    grievances = db.relationship('Grievance', back_populates='point_person')
    is_active = db.Column(db.Boolean, default=False, server_default=expression.false(), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'is_active': self.is_active
        }
