from extensions import db
from stages.DayTypes import DayTypes
from stages.Statuses import Statuses
from stages.Steps import Steps


class Stage(db.Model):
    step = db.Column(db.Enum(Steps), primary_key=True)
    status = db.Column(db.Enum(Statuses), primary_key=True)
    num_days = db.Column(db.Integer, nullable=True)
    day_type = db.Column(db.Enum(DayTypes), nullable=True)
    escalations = db.Relationship('Escalation', back_populates='stage', cascade='all, delete')