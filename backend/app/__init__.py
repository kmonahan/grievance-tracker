from flask import Flask

from config import Config
from extensions import db


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Register extensions
    db.init_app(app)

    # Register database tables
    from status.model import Status
    with app.app_context():
        db.create_all()

    # Register blueprints
    from status import bp as status_bp
    app.register_blueprint(status_bp, url_prefix='/status')

    return app
