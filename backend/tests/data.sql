INSERT INTO status (name)
VALUES
    ('Waiting to File'),
    ('Waiting to Schedule'),
    ('Scheduled'),
    ('Waiting on Decision'),
    ('Resolved'),
    ('Denied');

INSERT INTO step (name)
VALUES
    ('Step #1'),
    ('Step #2'),
    ('Step #3');

INSERT INTO category (name)
VALUES
    ('Pay/PTO'),
    ('Failure to Bargain'),
    ('Health & Safety'),
    ('Scheduling & Overtime'),
    ('Union Busting'),
    ('Other');