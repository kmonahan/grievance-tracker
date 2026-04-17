import datetime
from unittest.mock import patch

import pytest

from holidays.model import Holiday


class TestHolidays:
    @pytest.mark.usefixtures("app")
    def test_to_json(self):
        holiday = Holiday(id=1, name="May Day", date=datetime.datetime(2026, 5, 1))
        assert holiday.to_dict() == {'id': 1, 'name': 'May Day', 'date': '2026-05-01'}

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_get_holidays(self, _mock_verify_jwt, client):
        res = client.get('/holidays')
        assert res.status_code == 200
        assert res.json == [{'id': 1, 'name': "New Year's Day", 'date': '2026-01-01'},
            {'id': 2, 'name': "Martin Luther King Jr. Day", 'date': '2026-01-19'}]

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_create_holiday(self, _mock_verify_jwt, client, app):
        data = {'name': 'May Day', 'date': '2026-05-01'}
        res = client.post('/holidays/create', data=data)
        assert res.status_code == 201
        assert res.json == {'id': 3, 'name': 'May Day', 'date': '2026-05-01'}
        with app.app_context():
            holiday_from_db = Holiday.query.filter_by(name='May Day').first()
            assert holiday_from_db is not None

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_create_invalid_holiday(self, _mock_verify_jwt, client, app):
        data = {'name': 'Invalid Holiday'}
        res = client.post('/holidays/create', data=data)
        assert res.status_code == 400
        assert res.json == {'errors': {'date': ['This field is required.']}}
        with app.app_context():
            holiday_from_db = Holiday.query.filter_by(name='Invalid Holiday').first()
            assert holiday_from_db is None

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_update_holiday(self, _mock_verify_jwt, client, app):
        data = { 'name': "New Year's Day", 'date': '2027-01-01'}
        res = client.patch('/holidays/edit/1', data=data)
        assert res.status_code == 200
        assert res.json == { 'id': 1, 'name': "New Year's Day", 'date': '2027-01-01'}
        with app.app_context():
            holiday_from_db = Holiday.query.filter_by(id=1).first()
            assert holiday_from_db.date == datetime.datetime(2027, 1, 1)

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_delete_holiday(self, _mock_verify_jwt, client, app):
        res = client.delete('holidays/delete/1')
        assert res.status_code == 200
        with app.app_context():
            holiday_from_db = Holiday.query.filter_by(id=1).first()
            assert holiday_from_db is None