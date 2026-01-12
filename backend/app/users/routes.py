from flask import jsonify, request
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db
from users import bp
from users.EditUserForm import EditUserForm
from users.NewUserForm import NewUserForm
from users.model import User


@bp.route("/register", methods=['POST'])
def register():
    form = NewUserForm()
    if form.validate_on_submit():
        user = db.session.execute(db.select(User).filter_by(email=form.email.data)).scalar_one_or_none()
        if user is None:
            new_user = User(name=form.name.data, email=form.email.data,
                            password=generate_password_hash(form.password.data))
            db.session.add(new_user)
            db.session.commit()
            return jsonify(new_user.to_dict()), 201
        else:
            return jsonify({
                "error": "An account already exists for this user."
            }), 400
    else:
        return jsonify({'errors': form.errors}), 400


@bp.route('/login', methods=['POST'])
def login():
    data = request.form
    user = db.session.execute(db.select(User).filter_by(email=data['email'])).scalar_one_or_none()
    if user is None:
        return jsonify({
            "error": "No user account found for that email address."
        }), 401
    password_match = check_password_hash(user.password, data['password'])
    if not password_match:
        return jsonify({
            "error": "Incorrect password. Please try again."
        }), 401
    access_token = create_access_token(identity=user)
    return jsonify({
        "message": "You have successfully logged in",
        "access_token": access_token,
    })


@bp.route('/edit/<int:user_id>', methods=['PATCH'])
def edit(user_id):
    form = EditUserForm()
    if form.validate_on_submit():
        user = db.get_or_404(User, user_id)
        user.name = form.name.data
        user.email = form.email.data
        if form.password.data and len(form.password.data) > 0:
            user.password = generate_password_hash(form.password.data)
        db.session.commit()
        return jsonify(user.to_dict()), 200
    return jsonify({'errors': form.errors}), 400


@bp.route('')
def get_steps():
    users = db.session.execute(db.select(User)).scalars()
    return jsonify({'users': [user.to_dict() for user in users]})
