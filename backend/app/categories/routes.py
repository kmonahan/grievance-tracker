from flask import jsonify
from flask_jwt_extended import jwt_required

from categories import bp
from categories.model import Category


@bp.route('')
@jwt_required()
def get_categories():
    categories = Category.query.all()
    return jsonify({'categories': [category.to_dict() for category in categories]})


@bp.route('/<int:category_id>/grievances')
@jwt_required()
def get_related_grievances(category_id):
    category = Category.query.get_or_404(category_id)
    return jsonify({'grievances': [grievance.to_dict() for grievance in category.grievances]})
