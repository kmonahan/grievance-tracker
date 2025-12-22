from flask import Blueprint

bp = Blueprint('status', __name__)

from status import routes