TEST_GRIEVANCE = {
    'id': 1,
    'name': 'Test #1',
    'description': 'Asperiores magni aliquid quaerat deleniti repudiandae id odit et. Ducimus et voluptas doloribus nihil ut quo architecto ut. Laudantium dolorem sint voluptatum explicabo harum. Ea optio harum temporibus qui ut. Sint voluptatem rem voluptatem quisquam ut dolores. Placeat laborum explicabo vero delectus et modi. Soluta rerum dolorem molestias est. Ipsam culpa architecto earum maxime exercitationem. Voluptatum accusantium at quo libero deserunt aut est. Quod ut aut veritatis minus ut rerum beatae.',
    'category': 'Pay',
    'point_person': 'Jane Smith',
    'escalations': [{
        'id': 1,
        'date': '2025-12-19',
        'step': 'Step #1',
        'status': 'Waiting to Schedule',
        'date_due': '2026-01-02',
        'hearing_date': '2025-12-31'
    }]
}

TEST_GRIEVANCE_LIST = [
    TEST_GRIEVANCE,
]

TEST_CREATED_GRIEVANCE_PARTIAL = {
    'name': 'Test grievance',
    'description': 'Test description',
    'category_id': 4,
    'point_person_id': 2,
}

TEST_CREATED_GRIEVANCE = {
    'id': 2,
    'name': TEST_CREATED_GRIEVANCE_PARTIAL['name'],
    'description': TEST_CREATED_GRIEVANCE_PARTIAL['description'],
    'category': 'Health & Safety',
    'point_person': 'John Doe',
    'escalations': [
        {
            'id': 2,
            'date': '2025-12-19',
            'step': 'Step #1',
            'date_due': '2026-01-02',
            'status': 'Waiting to Schedule',
            'hearing_date': None
        }
    ]
}
