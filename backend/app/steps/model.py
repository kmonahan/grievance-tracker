from extensions import db
from steps.DayTypes import DayTypes


class Step(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(15))
    escalations = db.relationship('Escalation', back_populates='step', lazy=True)
    num_days = db.Column(db.Integer)
    day_type = db.Column(db.Enum(DayTypes))

    def to_dict(self):
        step_as_dict = {column.name: getattr(self, column.name) for column in self.__table__.columns}
        step_as_dict['day_type'] = self.day_type.value
        return step_as_dict