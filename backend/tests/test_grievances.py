from grievances.model import Grievance
from status.model import Status
from tests.constants import TEST_GRIEVANCE_LIST, TEST_CREATED_GRIEVANCE_PARTIAL, TEST_CREATED_GRIEVANCE
from users.model import User


class TestGrievances:
    def test_to_json(self):
        grievance = Grievance(id=1,
                              name="Test",
                              description="Asperiores magni aliquid quaerat deleniti repudiandae id odit et. Ducimus et voluptas doloribus nihil ut quo architecto ut. Laudantium dolorem sint voluptatum explicabo harum. Ea optio harum temporibus qui ut. Sint voluptatem rem voluptatem quisquam ut dolores. Placeat laborum explicabo vero delectus et modi. Soluta rerum dolorem molestias est. Ipsam culpa architecto earum maxime exercitationem. Voluptatum accusantium at quo libero deserunt aut est. Quod ut aut veritatis minus ut rerum beatae.",
                              status=Status(name='Test status'),
                              point_person=User(name='Karl Marx'), )
        assert grievance.to_dict() == {
            'id': 1,
            'name': 'Test',
            'description': 'Asperiores magni aliquid quaerat deleniti repudiandae id odit et. Ducimus et voluptas doloribus nihil ut quo architecto ut. Laudantium dolorem sint voluptatum explicabo harum. Ea optio harum temporibus qui ut. Sint voluptatem rem voluptatem quisquam ut dolores. Placeat laborum explicabo vero delectus et modi. Soluta rerum dolorem molestias est. Ipsam culpa architecto earum maxime exercitationem. Voluptatum accusantium at quo libero deserunt aut est. Quod ut aut veritatis minus ut rerum beatae.',
            'category': None,
            'status': 'Test status',
            'point_person': 'Karl Marx',
            'escalations': []
        }

    def test_get_all(self, client):
        res = client.get("/grievances/all")
        assert res.status_code == 200
        assert res.json['grievances'] == TEST_GRIEVANCE_LIST

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
