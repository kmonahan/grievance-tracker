from flask import Flask

from config import Config
from extensions import db


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Register extensions
    db.init_app(app)

    # Register database tables
    from categories.model import Category
    from users.model import User
    from grievances.model import Grievance
    from stages.model import Stage
    from escalations.model import Escalation
    from holidays.model import Holiday
    with app.app_context():
        db.create_all()

    # Register blueprints
    from categories import bp as categories_bp
    app.register_blueprint(categories_bp, url_prefix='/categories')
    from grievances import bp as grievances_bp
    app.register_blueprint(grievances_bp, url_prefix='/grievances')
    from users import bp as users_bp
    app.register_blueprint(users_bp, url_prefix='/users')
    from holidays import bp as holidays_bp
    app.register_blueprint(holidays_bp, url_prefix='/holidays')
    from escalations import bp as escalations_bp
    app.register_blueprint(escalations_bp, url_prefix='/escalate')

    return app
