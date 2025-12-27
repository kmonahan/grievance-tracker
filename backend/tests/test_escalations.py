from datetime import datetime

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
                                        'hearing_date': '2025-12-30', 'step': 'Step #1', 'status': 'Waiting to Schedule'}
