from extensions import db

class Step(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(15))

    def to_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}