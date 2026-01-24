from datetime import datetime, date
from unittest.mock import patch

import pytest
from freezegun import freeze_time

from escalations.model import Escalation
from stages.Statuses import Statuses
from stages.Steps import Steps
from users.model import User


class TestEscalation:
    @pytest.mark.usefixtures("app")
    def test_to_json(self):
        escalation = Escalation(id=1, date=datetime(2025, 12, 23), date_due=datetime(2026, 1, 2),
                                hearing_date=datetime(2025, 12, 30), step=Steps.ONE,
                                status=Statuses.WAITING_TO_SCHEDULE, grievance_id=1, user_id=1,
                                user=User(id=1, email='jsmith@example.com', name='Jane Smith', is_active=True), )
        assert escalation.to_dict() == {'id': 1, 'date': '2025-12-23', 'date_due': '2026-01-02',
                                        'hearing_date': '2025-12-30', 'step': 'Step #1',
                                        'status': 'Waiting to Schedule', 'deadline_missed': False,
                                        'user': {'id': 1, 'name': 'Jane Smith', 'is_active': True}}

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_edit_due_date(self, _mock_verify_jwt, client, app):
        res = client.post("/escalations/edit/1", data={'date_due': '2026-01-05'})
        assert res.status_code == 200
        with app.app_context():
            escalation_from_db = Escalation.query.filter_by(id=1).first()
            assert escalation_from_db.date_due == date(2026, 1, 5)

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_edit_due_date_with_invalid_field(self, _mock_verify_jwt, client):
        res = client.post("/escalations/edit/1", data={'due_date': '2026-01-05'})
        assert res.status_code == 400

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_edit_due_date_with_invalid_date(self, _mock_verify_jwt, client):
        res = client.post("/escalations/edit/1", data={'date_due': '1/5/2026'})
        assert res.status_code == 400

    @freeze_time(datetime(2026, 1, 10))
    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_get_recent_activity(self, _mock_verify_jwt, client):
        res = client.get("/escalations/recent")
        assert res.status_code == 200
        assert res.json == [
            {'date': '2026-01-09', 'date_due': '2026-01-30', 'deadline_missed': False, 'hearing_date': None, 'id': 5,
             'status': 'Waiting to File', 'step': 'Step #1',
             'user': {'id': 2, 'is_active': True, 'name': 'Cesar Chavez'}},
            {'date': '2025-12-31', 'date_due': '2026-01-08', 'deadline_missed': False, 'hearing_date': None, 'id': 4,
             'status': 'Waiting on Decision', 'step': 'Step #1',
             'user': {'id': 2, 'is_active': True, 'name': 'Cesar Chavez'}},
            {'date': '2026-01-10', 'date_due': None, 'deadline_missed': False, 'hearing_date': None, 'id': 6,
             'status': 'In Abeyance', 'step': 'Step #2', 'user': {'id': 1, 'is_active': True, 'name': 'Walter Reuther'}}]
