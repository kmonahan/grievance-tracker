from datetime import datetime

from escalations.calculate_date_due import DateDue
from escalations.model import Escalation
from grievances.model import Grievance
from steps.model import Step
from extensions import db


def escalate_grievance(grievance_id, step_id):
    calculator = DateDue()
    grievance = Grievance.query.get_or_404(grievance_id)
    step = Step.query.get_or_404(step_id)
    todays_date = datetime.now()
    escalation = Escalation(
        date=todays_date,
        date_due=calculator.calculate_date_due(todays_date, step.num_days, step.day_type),
        step=step,
        grievance=grievance
    )
    db.session.add(escalation)
    db.session.commit()
    return escalation