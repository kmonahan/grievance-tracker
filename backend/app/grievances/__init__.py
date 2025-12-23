from flask import Blueprint

bp = Blueprint('grievances', __name__)

from grievances import routes