from flask import jsonify

from app import db
from categories.model import Category
from grievances.escalate_grievance import escalate_grievance
from grievances import bp
from grievances.CreateGrievanceForm import CreateGrievanceForm
from grievances.model import Grievance
from users.model import User


@bp.route('/all')
def get_all():
    grievances = Grievance.query.all()
    return jsonify({'grievances': [grievance.to_dict() for grievance in grievances]})


def _prepare_form_choices() -> CreateGrievanceForm:
    form = CreateGrievanceForm()
    form.category_id.choices = [(c.id, c.name) for c in Category.query]
    form.point_person_id.choices = [(p.id, p.name) for p in User.query]
    return form


@bp.route('/add', methods=['POST'])
def create():
    form = _prepare_form_choices()
    if form.validate_on_submit():
        grievance = Grievance(
            name=form.name.data,
            description=form.description.data,
            category_id=form.category_id.data,
            point_person_id=form.point_person_id.data,
            status_id=1
        )
        db.session.add(grievance)
        db.session.commit()
        escalate_grievance(grievance_id=grievance.id, step_id=1)
        return jsonify(grievance.to_dict()), 201
    return jsonify({'errors': form.errors}), 400


@bp.route('/edit/<int:grievance_id>', methods=['PATCH'])
def update(grievance_id):
    form = _prepare_form_choices()
    if form.validate_on_submit():
        grievance = Grievance.query.get_or_404(grievance_id)
        grievance.name = form.name.data
        grievance.description = form.description.data
        grievance.category_id = form.category_id.data
        grievance.point_person_id = form.point_person_id.data
        db.session.commit()
        return jsonify(grievance.to_dict())
    return jsonify({'errors': form.errors}), 400


@bp.route('/delete/<int:grievance_id>', methods=['DELETE'])
def delete(grievance_id):
    grievance = Grievance.query.get_or_404(grievance_id)
    db.session.delete(grievance)
    db.session.commit()
    return jsonify({'ok': True})
