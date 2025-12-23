from datetime import datetime

from escalations.model import Escalation
from steps.model import Step


class TestEscalation:
    def test_to_json(self):
        escalation = Escalation(id=1, date=datetime(2025, 12, 23), date_due=datetime(2026,1,2), hearing_date=datetime(2025,12,30), step=Step(name='Step #1'),
                                grievance_id=1)
        assert escalation.to_dict() == {'id': 1, 'date': '2025-12-23', 'date_due': '2026-01-02',
                                        'hearing_date': '2025-12-30', 'step': 'Step #1',}
