import enum
from datetime import datetime

from sqlalchemy import and_

from stages.Statuses import status_with_due_dates, Statuses
from stages.Steps import Steps
from stages.calculate_date_due import DateDue
from escalations.model import Escalation
from grievances.model import Grievance
from extensions import db
from stages.model import Stage


def escalate_grievance(grievance_id: int, step: Steps, status: Statuses):
    calculator = DateDue()
    grievance = Grievance.query.get_or_404(grievance_id)
    todays_date = datetime.now()
    escalation = Escalation(
        date=todays_date,
        grievance=grievance,
        step=step,
        status=status,
    )
    if status in status_with_due_dates:
        stage = Stage.query.filter(and_(status == status), (step == step)).first()
        escalation.date_due = calculator.calculate_date_due(todays_date, stage.num_days, stage.day_type)
    db.session.add(escalation)
    db.session.commit()
    return escalation
