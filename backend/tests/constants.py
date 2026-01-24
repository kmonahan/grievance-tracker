TEST_GRIEVANCE = {'id': 1, 'name': 'Test #1', 'description': 'Test description #1', 'category': 'Pay',
    'point_person': 'Walter Reuther', 'escalations': [
        {'id': 1, 'date': '2025-12-19', 'step': 'Step #1', 'status': 'Waiting to Schedule', 'date_due': '2026-01-02',
            'hearing_date': '2025-12-31', 'deadline_missed': False,
            'user': {'id': 1, 'is_active': True, 'name': 'Walter Reuther'}}]}

TEST_GRIEVANCE_2 = {'id': 2, 'name': 'Test #2', 'description': 'Test description #2', 'category': 'Pay',
    'point_person': 'Cesar Chavez', 'escalations': [
        {'date': '2025-12-19', 'date_due': '2026-01-02', 'deadline_missed': False, 'hearing_date': None, 'id': 2,
         'status': 'Waiting to Schedule', 'step': 'Step #1',
         'user': {'id': 2, 'is_active': True, 'name': 'Cesar Chavez'}},
        {'date': '2025-12-21', 'date_due': None, 'deadline_missed': False, 'hearing_date': '2025-12-30', 'id': 3,
         'status': 'Scheduled', 'step': 'Step #1', 'user': {'id': 2, 'is_active': True, 'name': 'Cesar Chavez'}},
        {'date': '2025-12-31', 'date_due': '2026-01-08', 'deadline_missed': False, 'hearing_date': None, 'id': 4,
         'status': 'Waiting on Decision', 'step': 'Step #1',
         'user': {'id': 2, 'is_active': True, 'name': 'Cesar Chavez'}},
        {'date': '2026-01-09', 'date_due': '2026-01-30', 'deadline_missed': False, 'hearing_date': None, 'id': 5,
         'status': 'Waiting to File', 'step': 'Step #1', 'user': {'id': 2, 'is_active': True, 'name': 'Cesar Chavez'}}]}

TEST_GRIEVANCE_3 = {'id': 3, 'name': 'Test #3', 'description': 'Test description #3', 'category': 'PTO',
    'point_person': 'Clara Lemlich', 'escalations': []}

TEST_GRIEVANCE_4 = {'id': 4, 'name': 'Test #4', 'description': 'Test description #4', 'category': 'PTO',
    'point_person': 'Walter Reuther', 'escalations': [
        {'date': '2026-01-10', 'date_due': None, 'deadline_missed': False, 'hearing_date': None, 'id': 6,
         'status': 'In Abeyance', 'step': 'Step #2', 'user': {'id': 1, 'is_active': True, 'name': 'Walter Reuther'}}]}

TEST_GRIEVANCE_LIST = [TEST_GRIEVANCE, TEST_GRIEVANCE_2, TEST_GRIEVANCE_3, TEST_GRIEVANCE_4]

TEST_CREATED_GRIEVANCE_PARTIAL = {'name': 'Test grievance', 'description': 'Test description', 'category_id': 4,
    'point_person_id': 2, 'user_id': 1, }

TEST_CREATED_GRIEVANCE = {'id': 5, 'name': TEST_CREATED_GRIEVANCE_PARTIAL['name'],
    'description': TEST_CREATED_GRIEVANCE_PARTIAL['description'], 'category': 'Health & Safety',
    'point_person': 'Cesar Chavez', 'escalations': [
        {'id': 7, 'date': '2025-12-19', 'step': 'Step #1', 'date_due': '2026-01-02', 'status': 'Waiting to Schedule',
            'hearing_date': None, 'deadline_missed': False,
            'user': {'id': 1, 'name': 'Walter Reuther', 'is_active': True}}]}
