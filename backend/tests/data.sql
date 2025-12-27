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

INSERT INTO user (name)
VALUES
    ('Jane Smith'),
    ('John Doe');

INSERT into grievance (name, description, category_id, point_person_id)
VALUES
    ('Test #1', 'Asperiores magni aliquid quaerat deleniti repudiandae id odit et. Ducimus et voluptas doloribus nihil ut quo architecto ut. Laudantium dolorem sint voluptatum explicabo harum. Ea optio harum temporibus qui ut. Sint voluptatem rem voluptatem quisquam ut dolores. Placeat laborum explicabo vero delectus et modi. Soluta rerum dolorem molestias est. Ipsam culpa architecto earum maxime exercitationem. Voluptatum accusantium at quo libero deserunt aut est. Quod ut aut veritatis minus ut rerum beatae.', 1, 1);

INSERT into escalation (date, date_due, hearing_date, step, status, grievance_id)
VALUES
    ('2025-12-19', '2026-01-02', '2025-12-31', 'ONE', 'WAITING_TO_SCHEDULE', 1);

INSERT into holidays(date, name)
VALUES
    ('2026-01-01', "New Year's Day"),
    ('2026-01-19', "Martin Luther King Jr. Day")