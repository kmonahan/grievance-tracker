from flask import Blueprint

bp = Blueprint('categories', __name__)

from categories import routes