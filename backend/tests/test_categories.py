from categories.model import Category
from tests.constants import TEST_GRIEVANCE_LIST


class TestCategories:
    def test_to_json(self):
        category = Category(id=1, name="Test")
        assert category.to_dict() == {'id': 1, 'name': 'Test'}

    def test_get_all(self, client):
        res = client.get("/categories")
        assert res.status_code == 200
        assert res.json['categories'] == [
            {
                'id': 1,
                'name': 'Pay/PTO'
            },
            {
                'id': 2,
                'name': 'Failure to Bargain'
            },
            {
                'id': 3,
                'name': 'Health & Safety',
            },
            {
                'id': 4,
                'name': 'Scheduling & Overtime'
            },
            {
                'id': 5,
                'name': 'Union Busting'
            },
            {
                'id': 6,
                'name': 'Other'
            }]

    def test_get_grievances(self, client):
        res = client.get("/categories/1/grievances")
        assert res.status_code == 200
        assert res.json['grievances'] == TEST_GRIEVANCE_LIST