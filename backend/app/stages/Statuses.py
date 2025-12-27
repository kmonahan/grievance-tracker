import enum


class Statuses(enum.Enum):
    WAITING_TO_SCHEDULE = 'Waiting to Schedule'
    SCHEDULED = 'Scheduled'
    WAITING_ON_DECISION = 'Waiting on Decision'
    WAITING_TO_FILE = 'Waiting to File'
    RESOLVED = 'Resolved'
    DENIED = 'Denied'
    WITHDRAWN = 'Withdrawn'
    IN_ABEYANCE = 'In Abeyance'


status_with_due_dates = [
    Statuses.WAITING_TO_SCHEDULE,
    Statuses.SCHEDULED,
    Statuses.WAITING_ON_DECISION,
    Statuses.WAITING_TO_FILE,
]

inactive_status = [Statuses.RESOLVED, Statuses.DENIED, Statuses.WITHDRAWN]