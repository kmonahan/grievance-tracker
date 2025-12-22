from flask import jsonify

from steps import bp
from steps.model import Step


@bp.route('')
def get_steps():
    steps = Step.query.all()
    return jsonify({'steps': [step.to_dict() for step in steps]})