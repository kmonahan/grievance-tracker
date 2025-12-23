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

INSERT INTO user (name)
VALUES
    ('Jane Smith'),
    ('John Doe');

INSERT into grievance (name, description, category_id, status_id, point_person_id)
VALUES
    ('Test #1', 'Asperiores magni aliquid quaerat deleniti repudiandae id odit et. Ducimus et voluptas doloribus nihil ut quo architecto ut. Laudantium dolorem sint voluptatum explicabo harum. Ea optio harum temporibus qui ut. Sint voluptatem rem voluptatem quisquam ut dolores. Placeat laborum explicabo vero delectus et modi. Soluta rerum dolorem molestias est. Ipsam culpa architecto earum maxime exercitationem. Voluptatum accusantium at quo libero deserunt aut est. Quod ut aut veritatis minus ut rerum beatae.', 1, 2, 1)