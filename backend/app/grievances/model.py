from extensions import db

class Grievance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)

    def to_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}