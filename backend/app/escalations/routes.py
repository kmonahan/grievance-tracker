from datetime import timedelta, date, datetime

from flask import request, jsonify
from flask_jwt_extended import jwt_required

from app import db
from escalations import bp
from escalations.model import Escalation


def _convert_to_date(date_as_string):
    return datetime.strptime(date_as_string, '%Y-%m-%d').date()


@bp.route('/edit/<int:escalation_id>', methods=['POST'])
@jwt_required()
def edit_escalation(escalation_id):
    escalation = db.get_or_404(Escalation, escalation_id)
    date_due = request.form.get('date_due', type=_convert_to_date)
    if date_due is None:
        return jsonify({'error': 'Missing or invalid due date'}), 400
    escalation.date_due = date_due
    db.session.commit()
    return jsonify({'ok': True}), 200

@bp.route('/recent', methods=['GET'])
@jwt_required()
def get_recent_escalations():
    escalations = db.session.execute(db.select(Escalation).filter(Escalation.date >= date.today() + timedelta(days=-14)).order_by(Escalation.date_due.desc())).scalars()
    return jsonify([escalation.to_dict() for escalation in escalations])