from datetime import timedelta

from holidays.model import Holiday
from stages.DayTypes import DayTypes


class DateDue:
    def __init__(self):
        holidays = Holiday.query.all()
        self.holidays = [holiday.date for holiday in holidays]

    def calculate_date_due(self, start_date, num_days, day_type):
        if day_type == DayTypes.CALENDAR:
            return start_date + timedelta(days=num_days)
        remaining_days = num_days
        end_date = start_date
        while remaining_days > 0:
            end_date = end_date + timedelta(days=remaining_days)
            date_diff = end_date - start_date
            included_dates = {
                start_date + timedelta(days=days)
                for days in range(0, (date_diff.days + 1))
            }
            weekends = [date for date in included_dates if date.weekday() >= 5]
            included_dates = included_dates.difference(weekends)
            holidays = [date for date in self.holidays if end_date >= date >= start_date]
            included_dates = included_dates.difference(holidays)
            remaining_days = num_days - len(included_dates)
        return end_date