from flask import jsonify

from categories import bp
from categories.model import Category


@bp.route('')
def get_categories():
    categories = Category.query.all()
    return jsonify({'categories': [category.to_dict() for category in categories]})