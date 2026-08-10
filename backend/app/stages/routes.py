from flask import jsonify
from flask_jwt_extended import jwt_required

from app import db
from stages import bp
from stages.DayTypes import DayTypes
from stages.StageForm import StageForm
from stages.Statuses import Statuses
from stages.Steps import Steps
from stages.model import Stage


@bp.route('', methods=['GET'])
@jwt_required()
def get_all_stages():
    stages = db.session.execute(db.select(Stage)).scalars()
    return [stage.to_dict() for stage in stages]

@bp.route('/create', methods=['POST'])
@jwt_required()
def create_stage():
    form = StageForm()
    if form.validate_on_submit():
        new_stage = Stage(
            step=Steps(form.step.data),
            status=Statuses(form.status.data),
            num_days=form.num_days.data,
            day_type=DayTypes(int(form.day_type.data)) if form.day_type.data else None,
        )
        db.session.add(new_stage)
        db.session.commit()
        return jsonify(new_stage.to_dict()), 201
    return jsonify({'errors': form.errors}), 400

@bp.route('/edit/<step>/<status>', methods=['PATCH'])
@jwt_required()
def edit_stage(step, status):
    form = StageForm()
    if form.validate_on_submit():
        stage_to_update = db.get_or_404(Stage, (Steps[step], Statuses[status]))
        stage_to_update.step = Steps(form.step.data)
        stage_to_update.status = Statuses(form.status.data)
        stage_to_update.num_days = form.num_days.data
        stage_to_update.day_type = DayTypes(int(form.day_type.data)) if form.day_type.data else None
        db.session.commit()
        return jsonify(stage_to_update.to_dict()), 200
    return jsonify({'errors': form.errors}), 400

@bp.route('/delete/<step>/<status>', methods=['DELETE'])
@jwt_required()
def delete_stage(step, status):
    stage_to_remove = db.get_or_404(Stage, (Steps[step], Statuses[status]))
    db.session.delete(stage_to_remove)
    db.session.commit()
    return jsonify({'ok': True})
