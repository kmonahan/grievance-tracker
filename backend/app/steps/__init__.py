from flask import Blueprint

bp = Blueprint('steps', __name__)

from steps import routes