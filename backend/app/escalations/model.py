from extensions import db
from steps.model import Step


class Escalation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    date_due = db.Column(db.Date, nullable=True)
    hearing_date = db.Column(db.Date, nullable=True)
    step_id = db.Column(db.Integer, db.ForeignKey('step.id'), nullable=False)
    step = db.relationship(Step.__name__, back_populates='escalations', lazy=True)
    grievance_id = db.Column(db.Integer, db.ForeignKey('grievance.id'), nullable=False)
    grievance = db.relationship('Grievance', back_populates='escalations', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.strftime("%Y-%m-%d"),
            'date_due': self.date_due.strftime("%Y-%m-%d"),
            'hearing_date': self.hearing_date.strftime("%Y-%m-%d"),
            'step': self.step.name if self.step is not None else None,
        }