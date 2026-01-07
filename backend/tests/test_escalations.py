from datetime import datetime, date

import pytest

from escalations.model import Escalation
from stages.Statuses import Statuses
from stages.Steps import Steps


class TestEscalation:
    @pytest.mark.usefixtures("app")
    def test_to_json(self):
        escalation = Escalation(id=1, date=datetime(2025, 12, 23), date_due=datetime(2026, 1, 2),
                                hearing_date=datetime(2025, 12, 30), step=Steps.ONE,
                                status=Statuses.WAITING_TO_SCHEDULE,
                                grievance_id=1)
        assert escalation.to_dict() == {'id': 1, 'date': '2025-12-23', 'date_due': '2026-01-02',
                                        'hearing_date': '2025-12-30', 'step': 'Step #1', 'status': 'Waiting to Schedule', 'deadline_missed': False}

    def test_edit_due_date(self, client, app):
        res = client.post("/escalations/edit/1", data={'date_due': '2026-01-05'})
        assert res.status_code == 200
        with app.app_context():
            escalation_from_db = Escalation.query.filter_by(id=1).first()
            assert escalation_from_db.date_due == date(2026, 1, 5)

    def test_edit_due_date_with_invalid_field(self, client):
        res = client.post("/escalations/edit/1", data={'due_date': '2026-01-05'})
        assert res.status_code == 400

    def test_edit_due_date_with_invalid_date(self, client):
        res = client.post("/escalations/edit/1", data={'date_due': '1/5/2026'})
        assert res.status_code == 400