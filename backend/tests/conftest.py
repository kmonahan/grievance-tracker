import os
from unittest.mock import patch

import pytest
from __init__ import create_app
from config import Config
from extensions import db

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