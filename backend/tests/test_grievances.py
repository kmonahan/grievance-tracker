import datetime
from datetime import timedelta
from unittest.mock import patch

from freezegun import freeze_time

from constants import TEST_CREATED_GRIEVANCE_PARTIAL, TEST_CREATED_GRIEVANCE, TEST_GRIEVANCE, TEST_GRIEVANCE_LIST, \
    TEST_GRIEVANCE_2, TEST_GRIEVANCE_4
from escalations.model import Escalation
from extensions import db
from grievances.model import Grievance
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

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_get_all(self, _mock_verify_jwt, client):
        res = client.get("/grievances/all")
        assert res.status_code == 200
        assert res.json['grievances'] == TEST_GRIEVANCE_LIST

    @freeze_time(datetime.datetime(2025, 12, 19))
    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_create_grievance(self, _mock_verify_jwt, client, app):
        data = TEST_CREATED_GRIEVANCE_PARTIAL
        res = client.post("/grievances/add", data=data)
        with app.app_context():
            grievance_from_db = Grievance.query.filter_by(name=TEST_CREATED_GRIEVANCE_PARTIAL['name']).first()
            assert grievance_from_db is not None
        assert res.status_code == 201
        assert res.json == TEST_CREATED_GRIEVANCE

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_create_empty_grievance(self, _mock_verify_jwt, client):
        data = {}
        res = client.post("/grievances/add", data=data)
        assert res.status_code == 400
        assert res.json == {'errors': {
            'name': ['This field is required.'],
            'category_id': ['Not a valid choice.'],
            'point_person_id': ['Not a valid choice.'],
            'user_id': ['Not a valid choice.'],
        }}

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_create_invalid_grievance(self, _mock_verify_jwt, client):
        data = {
            'name': 'Test name',
            'category_id': 8,
            'point_person_id': 'Jane Smith',
            'user_id': 'Jane Smith',
        }
        res = client.post("/grievances/add", data=data)
        assert res.status_code == 400
        assert res.json == {'errors': {
            'category_id': ['Not a valid choice.'],
            'point_person_id': ['Invalid Choice: could not coerce.', 'Not a valid choice.'],
            'user_id': ['Invalid Choice: could not coerce.', 'Not a valid choice.'],
        }}

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_update_grievance(self, _mock_verify_jwt, client, app):
        data = {
            'name': 'Test name is edited',
            'description': 'Test description is edited.',
            'category_id': 1,
            'point_person_id': 1,
            'user_id': 1,
        }
        res = client.patch("/grievances/edit/1", data=data)
        with app.app_context():
            grievance_from_db = Grievance.query.filter_by(name=data['name']).first()
            assert grievance_from_db.id == 1
        assert res.status_code == 200
        assert res.json == {**TEST_GRIEVANCE, 'name': data['name'], 'description': data['description']}

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_delete_grievance(self, _mock_verify_jwt, client, app):
        res = client.delete("/grievances/delete/1")
        with app.app_context():
            grievance_from_db = Grievance.query.filter_by(id=1).first()
            assert grievance_from_db is None
        assert res.status_code == 200
        assert res.json == {'ok': True}

    @freeze_time(datetime.datetime(2026, 1, 2))
    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_advance_grievance(self, _mock_verify_jwt, client):
        res = client.post("/grievances/escalate/1", json={
            'status': Statuses.WAITING_TO_FILE.name,
            'step': Steps.ONE.name,
            'user_id': 1,
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
                    'hearing_date': '2025-12-31',
                    'deadline_missed': False,
                    'user': {'id': 1, 'is_active': True, 'name': 'Jane Smith'}
                },
                {
                    'id': 7,
                    'date': '2026-01-02',
                    'step': 'Step #1',
                    'status': 'Waiting to File',
                    'date_due': '2026-01-30',
                    'hearing_date': None,
                    'deadline_missed': False,
                    'user': {'id': 1, 'is_active': True, 'name': 'Jane Smith'}
                }
            ]
        }

    @freeze_time(datetime.datetime(2026, 1, 2))
    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_track_missed_deadlines(self, _mock_verify_jwt, client, app):
        with app.app_context():
            escalation = Escalation(date=datetime.datetime.now(), date_due=datetime.datetime.now() + timedelta(days=15),
                                    step=Steps.TWO, status=Statuses.WAITING_TO_SCHEDULE, grievance_id=1, user_id=1)
            db.session.add(escalation)
            db.session.commit()
        res = client.post("/grievances/missed/1", data={'deadline_missed': True})
        assert res.status_code == 200
        assert res.json == {'ok': True}
        with app.app_context():
            updated_escalation = Escalation.query.filter_by(id=7).first()
            assert updated_escalation.deadline_missed is True
        res = client.post("/grievances/missed/1", data={'deadline_missed': False})
        assert res.status_code == 200
        assert res.json == {'ok': True}
        with app.app_context():
            updated_escalation = Escalation.query.filter_by(id=7).first()
            assert updated_escalation.deadline_missed is False

    @freeze_time(datetime.datetime(2025, 12, 19))
    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_get_upcoming(self, _mock_verify_jwt, client):
        res = client.get("/grievances/upcoming")
        assert res.status_code == 200
        assert res.json == {"grievances": [TEST_GRIEVANCE, TEST_GRIEVANCE_2]}
        grievances = res.json['grievances']
        assert grievances[0] == TEST_GRIEVANCE

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_get_by_step(self, _mock_verify_jwt, client):
        res = client.get("/grievances/step/ONE")
        assert res.status_code == 200
        assert res.json == {"grievances": [TEST_GRIEVANCE, TEST_GRIEVANCE_2]}
        grievances = res.json['grievances']
        assert TEST_GRIEVANCE_4 not in grievances
