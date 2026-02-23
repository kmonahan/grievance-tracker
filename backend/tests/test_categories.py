from unittest.mock import patch

import pytest

from categories.model import Category
from constants import TEST_GRIEVANCE, TEST_GRIEVANCE_2


class TestCategories:
    @pytest.mark.usefixtures("app")
    def test_to_json(self):
        category = Category(id=1, name="Test")
        assert category.to_dict() == {'id': 1, 'name': 'Test'}

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_get_all(self, _mock_verify_jwt, client):
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

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_get_grievances(self, _mock_verify_jwt, client):
        res = client.get("/categories/1/grievances")
        assert res.status_code == 200
        assert res.json['grievances'] == [TEST_GRIEVANCE, TEST_GRIEVANCE_2]

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_create_category(self, _mock_verify_jwt, app, client):
        test_category = {
            'name': 'Test category'
        }
        data = test_category
        res = client.post("/categories/add", data=data)
        with app.app_context():
            category_from_db = Category.query.filter_by(name=test_category['name']).first()
            assert category_from_db is not None
        assert res.status_code == 201
        assert res.json == {
            'id': 8,
            'name': test_category['name']
        }

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_create_empty_category(self, _mock_verify_jwt, client):
        data = {}
        res = client.post("/categories/add", data=data)
        assert res.status_code == 400
        assert res.json == {'errors': {
            'name': ['This field is required.']
        }}