from flask import jsonify

from status import bp
from status.model import Status


@bp.route('')
def get_statuses():
    statuses = Status.query.all()
    return jsonify({'status': [status.to_dict() for status in statuses]})

@bp.route('/<int:status_id>/grievances')
def get_related_grievances(status_id):
    status = Status.query.get_or_404(status_id)
    return jsonify({'grievances': [grievance.to_dict() for grievance in status.grievances]})