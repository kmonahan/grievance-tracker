import datetime

from stages.DayTypes import DayTypes
from stages.calculate_date_due import DateDue


class TestStages:
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
