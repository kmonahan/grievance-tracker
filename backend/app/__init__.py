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
    from steps.model import Step
    from categories.model import Category
    from grievances.model import Grievance
    with app.app_context():
        db.create_all()

    # Register blueprints
    from status import bp as status_bp
    app.register_blueprint(status_bp, url_prefix='/status')
    from steps import bp as steps_bp
    app.register_blueprint(steps_bp, url_prefix='/steps')
    from categories import bp as categories_bp
    app.register_blueprint(categories_bp, url_prefix='/categories')
    from grievances import bp as grievances_bp
    app.register_blueprint(grievances_bp, url_prefix='/grievances')

    return app
