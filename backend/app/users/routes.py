from flask import jsonify

from users import bp
from users.model import User


@bp.route('')
def get_steps():
    users = User.query.all()
    return jsonify({'users': [user.to_dict() for user in users]})