import datetime

from freezegun import freeze_time

from grievances.model import Grievance
from tests.constants import TEST_CREATED_GRIEVANCE_PARTIAL, TEST_CREATED_GRIEVANCE, TEST_GRIEVANCE, TEST_GRIEVANCE_LIST

from stages.Statuses import Statuses
from stages.Steps import Steps
from users.model import User


class TestGrievances:
    def test_to_json(self):
        grievance = Grievance(id=1,
                              name="Test",
                              description="Asperiores magni aliquid quaerat deleniti repudiandae id odit et. Ducimus et voluptas doloribus nihil ut quo architecto ut. Laudantium dolorem sint voluptatum explicabo harum. Ea optio harum temporibus qui ut. Sint voluptatem rem voluptatem quisquam ut dolores. Placeat laborum explicabo vero delectus et modi. Soluta rerum dolorem molestias est. Ipsam culpa architecto earum maxime exercitationem. Voluptatum accusantium at quo libero deserunt aut est. Quod ut aut veritatis minus ut rerum beatae.",
                              point_person=User(name='Karl Marx'), )
        assert grievance.to_dict() == {
            'id': 1,
            'name': 'Test',
            'description': 'Asperiores magni aliquid quaerat deleniti repudiandae id odit et. Ducimus et voluptas doloribus nihil ut quo architecto ut. Laudantium dolorem sint voluptatum explicabo harum. Ea optio harum temporibus qui ut. Sint voluptatem rem voluptatem quisquam ut dolores. Placeat laborum explicabo vero delectus et modi. Soluta rerum dolorem molestias est. Ipsam culpa architecto earum maxime exercitationem. Voluptatum accusantium at quo libero deserunt aut est. Quod ut aut veritatis minus ut rerum beatae.',
            'category': None,
            'point_person': 'Karl Marx',
            'escalations': []
        }

    def test_get_all(self, client):
        res = client.get("/grievances/all")
        assert res.status_code == 200
        assert res.json['grievances'] == TEST_GRIEVANCE_LIST

    @freeze_time(datetime.datetime(2025, 12, 19))
    def test_create_grievance(self, client, app):
        data = TEST_CREATED_GRIEVANCE_PARTIAL
        res = client.post("/grievances/add", data=data)
        with app.app_context():
            grievance_from_db = Grievance.query.filter_by(name=TEST_CREATED_GRIEVANCE_PARTIAL['name']).first()
            assert grievance_from_db is not None
        assert res.status_code == 201
        assert res.json == TEST_CREATED_GRIEVANCE

    def test_create_empty_grievance(self, client):
        data = {}
        res = client.post("/grievances/add", data=data)
        assert res.status_code == 400
        assert res.json == {'errors': {
            'name': ['This field is required.'],
            'category_id': ['Not a valid choice.'],
            'point_person_id': ['Not a valid choice.']
        }}

    def test_create_invalid_grievance(self, client):
        data = {
            'name': 'Test name',
            'category_id': 8,
            'point_person_id': 'Jane Smith'
        }
        res = client.post("/grievances/add", data=data)
        assert res.status_code == 400
        assert res.json == {'errors': {
            'category_id': ['Not a valid choice.'],
            'point_person_id': ['Invalid Choice: could not coerce.', 'Not a valid choice.']
        }}

    def test_update_grievance(self, client, app):
        data = {
            'name': 'Test name is edited',
            'description': 'Test description is edited.',
            'category_id': 1,
            'point_person_id': 1,
        }
        res = client.patch("/grievances/edit/1", data=data)
        with app.app_context():
            grievance_from_db = Grievance.query.filter_by(name=data['name']).first()
            assert grievance_from_db.id == 1
        assert res.status_code == 200
        assert res.json == {**TEST_GRIEVANCE, 'name': data['name'], 'description': data['description']}

    def test_delete_grievance(self, client, app):
        res = client.delete("/grievances/delete/1")
        with app.app_context():
            grievance_from_db = Grievance.query.filter_by(id=1).first()
            assert grievance_from_db is None
        assert res.status_code == 200
        assert res.json == {'ok': True}

    @freeze_time(datetime.datetime(2026, 1, 2))
    def test_advance_grievance(self, client):
        res = client.post("/grievances/escalate/1", json={
            'status': Statuses.WAITING_TO_FILE.name,
            'step': Steps.ONE.name
        })
        assert res.status_code == 200
        assert res.json == {
            **TEST_GRIEVANCE,
            'escalations': [
                {
                    'id': 1,
                    'date': '2025-12-19',
                    'step': 'Step #1',
                    'status': 'Waiting to Schedule',
                    'date_due': '2026-01-02',
                    'hearing_date': '2025-12-31'
                },
                {
                    'id': 2,
                    'date': '2026-01-02',
                    'step': 'Step #1',
                    'status': 'Waiting to File',
                    'date_due': '2026-01-30',
                    'hearing_date': None
                }
            ]
        }
