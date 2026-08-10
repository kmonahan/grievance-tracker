from unittest.mock import patch

import pytest

from stages.DayTypes import DayTypes
from stages.Statuses import Statuses
from stages.Steps import Steps
from stages.model import Stage


class TestStages:
    @pytest.mark.usefixtures("app")
    def test_to_json(self):
        stage = Stage(step=Steps.ONE, status=Statuses.WAITING_TO_SCHEDULE, num_days=10, day_type=DayTypes.WORKING)
        assert stage.to_dict() == {'step': 'Step #1', 'status': 'Waiting to Schedule', 'num_days': 10, 'day_type': 1}

    @pytest.mark.usefixtures("app")
    def test_to_json_no_day_type(self):
        stage = Stage(step=Steps.ONE, status=Statuses.SCHEDULED, num_days=None, day_type=None)
        assert stage.to_dict() == {'step': 'Step #1', 'status': 'Scheduled', 'num_days': None, 'day_type': None}

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_get_stages(self, _mock_verify_jwt, client):
        res = client.get('/stages')
        assert res.status_code == 200
        assert {'step': 'Step #1', 'status': 'Waiting to Schedule', 'num_days': 10, 'day_type': 1} in res.json

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_create_stage(self, _mock_verify_jwt, client, app):
        data = {'step': 'Step #3', 'status': 'Waiting on Decision', 'num_days': 6, 'day_type': 1}
        res = client.post('/stages/create', data=data)
        assert res.status_code == 201
        assert res.json == {'step': 'Step #3', 'status': 'Waiting on Decision', 'num_days': 6, 'day_type': 1}
        with app.app_context():
            stage_from_db = Stage.query.filter_by(step=Steps.THREE, status=Statuses.WAITING_ON_DECISION).first()
            assert stage_from_db is not None

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_create_invalid_stage(self, _mock_verify_jwt, client, app):
        data = {'num_days': 6}
        res = client.post('/stages/create', data=data)
        assert res.status_code == 400
        assert res.json == {'errors': {'step': ['This field is required.'], 'status': ['This field is required.']}}

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_update_stage(self, _mock_verify_jwt, client, app):
        data = {'step': 'Step #1', 'status': 'Waiting to Schedule', 'num_days': 15, 'day_type': 2}
        res = client.patch('/stages/edit/ONE/WAITING_TO_SCHEDULE', data=data)
        assert res.status_code == 200
        assert res.json == {'step': 'Step #1', 'status': 'Waiting to Schedule', 'num_days': 15, 'day_type': 2}
        with app.app_context():
            stage_from_db = Stage.query.filter_by(step=Steps.ONE, status=Statuses.WAITING_TO_SCHEDULE).first()
            assert stage_from_db.num_days == 15
            assert stage_from_db.day_type == DayTypes.CALENDAR

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_delete_stage(self, _mock_verify_jwt, client, app):
        res = client.delete('/stages/delete/ONE/SCHEDULED')
        assert res.status_code == 200
        with app.app_context():
            stage_from_db = Stage.query.filter_by(step=Steps.ONE, status=Statuses.SCHEDULED).first()
            assert stage_from_db is None
