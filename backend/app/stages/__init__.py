from flask import Blueprint

bp = Blueprint('stages', __name__)

from stages import routes
