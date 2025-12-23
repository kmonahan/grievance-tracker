from flask import jsonify

from grievances import bp
from grievances.model import Grievance


@bp.route('/all')
def get_all():
    grievances = Grievance.query.all()
    return jsonify({'grievances': [grievance.to_dict() for grievance in grievances]})
