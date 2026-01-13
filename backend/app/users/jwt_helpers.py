from extensions import jwt, db
from users.Token import Token
from users.model import User


@jwt.user_identity_loader
def user_identity_lookup(user: User):
    return user.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return db.session.execute(db.select(User).filter_by(id=identity)).scalar_one()

@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(_jwt_header, jwt_payload: dict):
    jti = jwt_payload['jti']
    token_is_active = db.session.query(Token.is_active).filter_by(jti=jti).scalar()
    return token_is_active is False