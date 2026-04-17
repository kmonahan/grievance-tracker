from flask import Blueprint

bp = Blueprint('holidays', __name__)

from holidays import routes