from flask import jsonify

from escalations import bp
from grievances.escalate_grievance import escalate_grievance


@bp.route('<int:grievance_id>/<int:step_id>', methods=['POST'])
def create(grievance_id, step_id):
    escalation = escalate_grievance(grievance_id, step_id)
    return jsonify(escalation.to_dict()), 201
