from flask import jsonify

from app import db
from categories.model import Category
from grievances import bp
from grievances.CreateGrievanceForm import CreateGrievanceForm
from grievances.model import Grievance
from status.model import Status
from users.model import User


@bp.route('/all')
def get_all():
    grievances = Grievance.query.all()
    return jsonify({'grievances': [grievance.to_dict() for grievance in grievances]})


@bp.route('/add', methods=['POST'])
def create():
    form = CreateGrievanceForm()
    form.category_id.choices = [(c.id, c.name) for c in Category.query]
    form.point_person_id.choices = [(p.id, p.name) for p in User.query]
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
        return jsonify(grievance.to_dict()), 201
    return jsonify({'errors': form.errors}), 400
