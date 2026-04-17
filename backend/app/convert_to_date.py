from datetime import datetime


def convert_to_date(date_as_string):
    return datetime.strptime(date_as_string, '%Y-%m-%d').date()