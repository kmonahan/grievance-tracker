from steps.DayTypes import DayTypes
from status.model import Status
from steps.model import Step
from categories.model import Category
from users.model import User
from grievances.model import Grievance
from escalations.model import Escalation


class TestSteps:
    def test_to_json(self):
        step = Step(id=1, name="Test", num_days=2, day_type=DayTypes.WORKING)
        assert step.to_dict() == {'id': 1, 'name': 'Test', 'num_days': 2, 'day_type': DayTypes.WORKING.value}

    def test_get_all(self, client):
        res = client.get("/steps")
        assert res.status_code == 200
        assert res.json['steps'] == [
            {
                'id': 1,
                'name': 'Step #1',
                'num_days': 10,
                'day_type': DayTypes.WORKING.value,
            },
            {
                'id': 2,
                'name': 'Step #2',
                'num_days': 20,
                'day_type': DayTypes.WORKING.value,
            },
            {
                'id': 3,
                'name': 'Step #3',
                'num_days': 6,
                'day_type': DayTypes.WORKING.value,
            }]
