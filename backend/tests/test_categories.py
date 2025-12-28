import pytest

from categories.model import Category
from constants import TEST_GRIEVANCE, TEST_GRIEVANCE_2


class TestCategories:
    @pytest.mark.usefixtures("app")
    def test_to_json(self):
        category = Category(id=1, name="Test")
        assert category.to_dict() == {'id': 1, 'name': 'Test'}

    def test_get_all(self, client):
        res = client.get("/categories")
        assert res.status_code == 200
        assert res.json['categories'] == [
            {
                'id': 1,
                'name': 'Pay'
            },
            {
                'id': 2,
                'name': 'PTO'
            },
            {
                'id': 3,
                'name': 'Failure to Bargain'
            },
            {
                'id': 4,
                'name': 'Health & Safety',
            },
            {
                'id': 5,
                'name': 'Scheduling & Overtime'
            },
            {
                'id': 6,
                'name': 'Union Busting'
            },
            {
                'id': 7,
                'name': 'Other'
            }]

    def test_get_grievances(self, client):
        res = client.get("/categories/1/grievances")
        assert res.status_code == 200
        assert res.json['grievances'] == [TEST_GRIEVANCE, TEST_GRIEVANCE_2]