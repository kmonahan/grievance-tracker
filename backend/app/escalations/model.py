from sqlalchemy import ForeignKeyConstraint

from extensions import db
from stages.Statuses import Statuses
from stages.Steps import Steps


class Escalation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    date_due = db.Column(db.Date, nullable=True)
    hearing_date = db.Column(db.Date, nullable=True)
    stage = db.relationship('Stage', back_populates='escalations', lazy=True)
    step = db.Column(db.Enum(Steps), nullable=False)
    status = db.Column(db.Enum(Statuses), nullable=False)
    grievance_id = db.Column(db.Integer, db.ForeignKey('grievance.id'), nullable=False)
    grievance = db.relationship('Grievance', back_populates='escalations', lazy=True)
    deadline_missed = db.Column(db.Boolean, nullable=True)

    __table_args__ = (
        ForeignKeyConstraint(['step', 'status'], ['stage.step', 'stage.status']),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.strftime("%Y-%m-%d"),
            'date_due': self.date_due.strftime("%Y-%m-%d") if self.date_due else None,
            'hearing_date': self.hearing_date.strftime("%Y-%m-%d") if self.hearing_date else None,
            'step': self.step.value,
            'status': self.status.value,
            'deadline_missed': self.deadline_missed if self.deadline_missed else False,
        }