import os

import pytest
from werkzeug.security import generate_password_hash

from __init__ import create_app
from config import Config
from extensions import db
from users.model import User

with open(os.path.join(os.path.dirname(__file__), 'data.sql'), 'rb') as f:
    _data_sql = f.read().decode('utf8')

@pytest.fixture()
def app():
    test_app_config = Config()
    test_app_config.TESTING = True
    test_app_config.SQLALCHEMY_DATABASE_URI = "sqlite://"
    app = create_app(test_app_config)
    app.config.update()
    with app.app_context():
        db.engine.raw_connection().cursor().executescript(_data_sql)
    yield app

    with app.app_context():
        db.session.remove()
        db.drop_all()

@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()

@pytest.fixture()
def set_passwords(app):
    with app.app_context():
        users = db.session.execute(db.select(User)).scalars()
        for user in users:
            user.password = generate_password_hash(user.password)
        db.session.commit()
    return app