INSERT INTO stage (step, status, num_days, day_type)
VALUES
    ('ONE', 'WAITING_TO_SCHEDULE', 10, 'WORKING'),
    ('ONE', 'WAITING_TO_FILE', 20, 'WORKING');

INSERT INTO category (name)
VALUES
    ('Pay'),
    ('PTO'),
    ('Failure to Bargain'),
    ('Health & Safety'),
    ('Scheduling & Overtime'),
    ('Union Busting'),
    ('Other');

INSERT INTO user (name, email, password, is_active)
VALUES
    ('Walter Reuther', 'wreuther@example.com', 'password123', TRUE),
    ('Cesar Chavez', 'cchavez@example.com', 'password123', TRUE),
    ('Clara Lemlich', 'clemlich@example.com', 'password123', TRUE),
    ('Jimmy Hoffa', 'jhoffa@example.com', 'password123', FALSE);

INSERT into grievance (name, description, category_id, point_person_id)
VALUES
    ('Test #1', 'Test description #1', 1, 1),
    ('Test #2', 'Test description #2', 1, 2),
    ('Test #3', 'Test description #3', 2, 3),
    ('Test #4', 'Test description #4', 2, 1);

INSERT into escalation (date, date_due, hearing_date, step, status, grievance_id, user_id)
VALUES
    ('2025-12-19', '2026-01-02', '2025-12-31', 'ONE', 'WAITING_TO_SCHEDULE', 1, 1),
    ('2025-12-19', '2026-01-02', NULL, 'ONE', 'WAITING_TO_SCHEDULE', 2, 2),
    ('2025-12-21', NULL, '2025-12-30', 'ONE', 'SCHEDULED', 2, 2),
    ('2025-12-31', '2026-01-08', NULL, 'ONE', 'WAITING_ON_DECISION', 2, 2),
    ('2026-01-09', '2026-01-30', NULL, 'ONE', 'WAITING_TO_FILE', 2, 2),
    ('2026-01-10', NULL, NULL, 'TWO', 'IN_ABEYANCE', 4, 1);

INSERT into holidays(date, name)
VALUES
    ('2026-01-01', "New Year's Day"),
    ('2026-01-19', "Martin Luther King Jr. Day")