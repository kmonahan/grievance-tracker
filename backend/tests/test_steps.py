import datetime

from steps.DayTypes import DayTypes
from escalations.calculate_date_due import DateDue
from steps.model import Step


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

    def test_calculate_date_due_calendar(self, app):
        with app.app_context():
            calculator = DateDue()
        assert calculator.calculate_date_due(datetime.datetime(2025, 10, 10), 10, DayTypes.CALENDAR) == datetime.datetime(2025, 10, 20)

    def test_calculate_date_due_working(self, app):
        with app.app_context():
            calculator = DateDue()
        assert calculator.calculate_date_due(datetime.datetime(2025, 10, 10), 10, DayTypes.WORKING) == datetime.datetime(2025, 10, 23)

    def test_calculate_date_due_holiday(self, app):
        with app.app_context():
            calculator = DateDue()
        assert calculator.calculate_date_due(datetime.datetime(2025, 12, 30), 28, DayTypes.WORKING) == datetime.datetime(2026, 2, 9)
