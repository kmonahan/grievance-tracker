from flask import jsonify, request
from flask_jwt_extended import create_access_token, get_jti, get_jwt, jwt_required, create_refresh_token, \
    current_user
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db
from users import bp
from users.EditUserForm import EditUserForm
from users.NewUserForm import NewUserForm
from users.Token import Token
from users.model import User


@bp.route("/register", methods=['POST'])
@jwt_required()
def register():
    form = NewUserForm()
    if form.validate_on_submit():
        user = db.session.execute(db.select(User).filter_by(email=form.email.data)).scalar_one_or_none()
        if user is None:
            new_user = User(name=form.name.data, email=form.email.data,
                            password=generate_password_hash(form.password.data), is_active=True)
            db.session.add(new_user)
            db.session.commit()
            return jsonify(new_user.to_dict()), 201
        else:
            return jsonify({
                "error": "An account already exists for this user."
            }), 400
    else:
        return jsonify({'errors': form.errors}), 400

def _store_token(encoded_token: str, user_id: int):
    jti = get_jti(encoded_token)
    token = Token(jti=jti, user_id=user_id, is_active=True)
    db.session.add(token)
    db.session.commit()

@bp.route('/login', methods=['POST'])
def login():
    data = request.form
    user = db.session.execute(db.select(User).filter_by(email=data['email'])).scalar_one_or_none()
    if user is None:
        return jsonify({
            "error": "No user account found for that email address."
        }), 401
    if user.is_active is not True:
        return jsonify({
            "error": "This user account is not active."
        }), 403
    password_match = check_password_hash(user.password, data['password'])
    if not password_match:
        return jsonify({
            "error": "Incorrect password. Please try again."
        }), 401
    access_token = create_access_token(identity=user, fresh=True)
    refresh_token = create_refresh_token(identity=user)
    _store_token(access_token, user.id)
    _store_token(refresh_token, user.id)
    db.session.commit()
    return jsonify({
        "message": "You have successfully logged in",
        "access_token": access_token,
        "refresh_token": refresh_token
    })

@bp.route('/logout', methods=['DELETE'])
@jwt_required(verify_type=False)
def revoke_token():
    token = get_jwt()
    jti = token['jti']
    token = db.session.execute(db.select(Token).filter_by(jti=jti)).scalar()
    token.is_active = False
    db.session.commit()
    return "", 204

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    if not current_user:
        return jsonify({'error': 'You must be logged in'}), 403
    access_token = create_access_token(identity=current_user, fresh=False)
    _store_token(access_token, current_user.id)
    return jsonify(access_token=access_token)

@bp.route('/edit/<int:user_id>', methods=['PATCH'])
@jwt_required()
def edit(user_id):
    form = EditUserForm()
    if form.validate_on_submit():
        user = db.get_or_404(User, user_id)
        existing_email = db.session.execute(db.select(User).filter_by(email=form.email.data)).scalar_one_or_none()
        if existing_email is not None and existing_email.id != user_id:
            return jsonify({'errors': {
                'email': ['Email address is already in use']
            }}), 400
        user.name = form.name.data
        user.email = form.email.data
        if form.password.data and len(form.password.data) > 0:
            user.password = generate_password_hash(form.password.data)
        db.session.commit()
        return jsonify(user.to_dict()), 200
    return jsonify({'errors': form.errors}), 400


@bp.route('/deactivate/<int:user_id>', methods=['PATCH'])
@jwt_required()
def deactivate(user_id):
    user = db.get_or_404(User, user_id)
    user.is_active = False
    tokens = db.session.execute(db.select(Token).filter(Token.user_id == user.id and Token.is_active == True)).scalars()
    for token in tokens:
        token.is_active = False
    db.session.commit()
    return "", 204

@bp.route('/reactivate/<int:user_id>', methods=['PATCH'])
@jwt_required()
def reactivate(user_id):
    user = db.get_or_404(User, user_id)
    user.is_active = True
    db.session.commit()
    return "", 204

@bp.route('')
@jwt_required()
def get_all_users():
    users = db.session.execute(db.select(User)).scalars()
    return jsonify({'users': [user.to_dict() for user in users]})

@bp.route('/active')
@jwt_required()
def get_active_users():
    users = db.session.execute(db.select(User).filter_by(is_active=True)).scalars()
    return jsonify({'users': [user.to_dict() for user in users]})
