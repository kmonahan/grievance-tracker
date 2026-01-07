from flask import Blueprint

bp = Blueprint('escalations', __name__)

from escalations import routes