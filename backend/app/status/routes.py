from flask import jsonify

from status import bp
from status.model import Status


@bp.route('')
def get_statuses():
    statuses = Status.query.all()
    return jsonify({'status': [status.to_dict() for status in statuses]})