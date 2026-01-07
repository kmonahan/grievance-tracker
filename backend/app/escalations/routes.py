import datetime

from flask import request, jsonify

from app import db
from escalations import bp
from escalations.model import Escalation


def _convert_to_date(date_as_string):
    return datetime.datetime.strptime(date_as_string, '%Y-%m-%d').date()


@bp.route('/edit/<int:escalation_id>', methods=['POST'])
def edit_escalation(escalation_id):
    escalation = Escalation.query.get_or_404(escalation_id)
    date_due = request.form.get('date_due', type=_convert_to_date)
    if date_due is None:
        return jsonify({'error': 'Missing or invalid due date'}), 400
    escalation.date_due = date_due
    db.session.commit()
    return jsonify({'ok': True}), 200
