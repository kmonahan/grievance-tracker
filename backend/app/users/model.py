from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    grievances = db.relationship('Grievance', back_populates='point_person')

    def to_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}