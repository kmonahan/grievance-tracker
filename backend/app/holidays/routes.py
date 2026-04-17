from flask import jsonify
from flask_jwt_extended import jwt_required

from app import db
from holidays import bp
from holidays.HolidayForm import HolidayForm
from holidays.model import Holiday


@bp.route('', methods=['GET'])
@jwt_required()
def get_all_holidays():
    holidays = db.session.execute(db.select(Holiday)).scalars()
    return [holiday.to_dict() for holiday in holidays]

@bp.route('/create', methods=['POST'])
@jwt_required()
def create_holiday():
    form = HolidayForm()
    if form.validate_on_submit():
        new_holiday = Holiday(name=form.name.data, date=form.date.data)
        db.session.add(new_holiday)
        db.session.commit()
        return jsonify(new_holiday.to_dict()), 201
    return jsonify({'errors': form.errors}), 400

@bp.route('/edit/<int:holiday_id>', methods=['PATCH'])
@jwt_required()
def edit_holiday(holiday_id):
    form = HolidayForm()
    if form.validate_on_submit():
        holiday_to_update = db.get_or_404(Holiday, holiday_id)
        holiday_to_update.name = form.name.data
        holiday_to_update.date = form.date.data
        db.session.commit()
        return jsonify(holiday_to_update.to_dict()), 200
    return jsonify({'errors': form.errors}), 400

@bp.route('/delete/<int:holiday_id>', methods=['DELETE'])
@jwt_required()
def delete_holiday(holiday_id):
    holiday_to_remove = db.get_or_404(Holiday, holiday_id)
    db.session.delete(holiday_to_remove)
    db.session.commit()
    return jsonify({'ok': True})