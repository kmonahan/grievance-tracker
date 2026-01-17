from datetime import datetime

from flask import jsonify, request
from sqlalchemy import and_, desc, func
from sqlalchemy.orm import aliased

from app import db
from categories.model import Category
from escalations.model import Escalation
from grievances import bp
from grievances.CreateGrievanceForm import CreateGrievanceForm
from grievances.model import Grievance
from stages.Statuses import Statuses, status_with_due_dates
from stages.Steps import Steps
from stages.calculate_date_due import DateDue
from stages.model import Stage
from users.model import User


@bp.route('/all')
def get_all():
    grievances = Grievance.query.all()
    return jsonify({'grievances': [grievance.to_dict() for grievance in grievances]})


@bp.route('/upcoming')
def get_upcoming():
    start_date = request.form.get('start_date', default=datetime.today())
    grievances = Grievance.query.join(Escalation.grievance).filter(Escalation.date_due >= start_date)
    return jsonify({'grievances': [grievance.to_dict() for grievance in grievances]})


def _prepare_form_choices() -> CreateGrievanceForm:
    form = CreateGrievanceForm()
    form.category_id.choices = [(c.id, c.name) for c in Category.query]
    user_choices = [(p.id, p.name) for p in User.query]
    form.point_person_id.choices = user_choices
    form.user_id.choices = user_choices
    return form


def escalate_grievance(grievance: Grievance, step: Steps, status: Statuses, user_id: int):
    calculator = DateDue()
    todays_date = datetime.now()
    escalation = Escalation(
        date=todays_date,
        grievance=grievance,
        step=step,
        status=status,
        user_id=user_id,
    )
    if status in status_with_due_dates:
        stage = Stage.query.filter(and_(Stage.status == status), (Stage.step == step)).first()
        escalation.date_due = calculator.calculate_date_due(todays_date, stage.num_days, stage.day_type)
    db.session.add(escalation)
    db.session.commit()
    return escalation


@bp.route('/add', methods=['POST'])
def create():
    form = _prepare_form_choices()
    if form.validate_on_submit():
        grievance = Grievance(
            name=form.name.data,
            description=form.description.data,
            category_id=form.category_id.data,
            point_person_id=form.point_person_id.data,
        )
        db.session.add(grievance)
        db.session.commit()
        escalate_grievance(grievance=grievance, user_id=form.user_id.data, step=Steps.ONE,
                           status=Statuses.WAITING_TO_SCHEDULE)
        return jsonify(grievance.to_dict()), 201
    return jsonify({'errors': form.errors}), 400


@bp.route('/edit/<int:grievance_id>', methods=['PATCH'])
def update(grievance_id):
    form = _prepare_form_choices()
    if form.validate_on_submit():
        grievance = db.get_or_404(Grievance, grievance_id)
        grievance.name = form.name.data
        grievance.description = form.description.data
        grievance.category_id = form.category_id.data
        grievance.point_person_id = form.point_person_id.data
        db.session.commit()
        return jsonify(grievance.to_dict())
    return jsonify({'errors': form.errors}), 400


@bp.route('/delete/<int:grievance_id>', methods=['DELETE'])
def delete(grievance_id):
    grievance = db.get_or_404(Grievance, grievance_id)
    db.session.delete(grievance)
    db.session.commit()
    return jsonify({'ok': True})


@bp.route('/escalate/<int:grievance_id>', methods=['POST'])
def escalate(grievance_id):
    grievance = db.get_or_404(Grievance, grievance_id)
    try:
        data = request.get_json()
        status = Statuses[data['status']]
        step = Steps[data['step']]
        escalate_grievance(grievance=grievance, step=step, status=status, user_id=data['user_id'])
        return jsonify(grievance.to_dict()), 200
    except KeyError:
        return jsonify({'error': 'Missing or invalid step or status'}), 400


def is_it_true(value):
    return value.lower() == 'true'


@bp.route('/missed/<int:grievance_id>', methods=['POST'])
def missed(grievance_id):
    escalation = Escalation.query.filter_by(grievance_id=grievance_id).order_by(desc(Escalation.date)).first_or_404()
    escalation.deadline_missed = request.form.get('deadline_missed', default=True, type=is_it_true)
    db.session.commit()
    return jsonify({'ok': True}), 200


@bp.route('/step/<step_key>', methods=['GET'])
def get_by_step(step_key):
    try:
        step = Steps[step_key]
        subsubquery = db.session.query(Escalation, func.row_number().over(partition_by=Escalation.grievance_id,
                                                                          order_by=desc(Escalation.date)).label(
            "row_number")).subquery()
        subquery = db.session.query(subsubquery).filter(subsubquery.c.row_number == 1).subquery()
        aliased_escalation = aliased(Escalation, subquery)
        grievances = Grievance.query.join(aliased_escalation.grievance).filter(aliased_escalation.step == step)
        return jsonify({'grievances': [grievance.to_dict() for grievance in grievances]})
    except KeyError:
        return jsonify({'error': 'Missing or invalid step key'}), 400
