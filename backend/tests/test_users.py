import pytest

from extensions import db
from users.model import User


class TestUser:
    @pytest.mark.usefixtures("app")
    def test_to_json(self):
        user = User(id=1, name="Test")
        assert user.to_dict() == {'id': 1, 'name': 'Test'}

    def test_get_all(self, client):
        res = client.get("/users")
        assert res.status_code == 200
        assert res.json['users'] == [
            {
                'id': 1,
                'name': 'Jane Smith'
            },
            {
                'id': 2,
                'name': 'John Doe'
            }]

    def test_register_user(self, client, app):
        res = client.post('/users/register', data={
            'name': 'Sarah Johnson',
            'email': 'sjohnson@example.com',
            'password': 'bpl psa is great',
            'confirm': 'bpl psa is great'
        })
        assert res.status_code == 201
        with app.app_context():
            new_user = db.session.execute(db.select(User).filter_by(email='sjohnson@example.com')).scalar()
            assert new_user.id == 3
        assert res.json == {
            'id': 3,
            'name': 'Sarah Johnson'
        }

    def test_register_invalid_user(self, client, app):
        res = client.post('/users/register', data={
            'name': 'Sarah Johnson',
            'email': 'sjohnson',
            'password': 'bpl psa is great',
            'confirm': 'bpl psa is great!'
        })
        assert res.status_code == 400
        with app.app_context():
            new_user = db.session.execute(db.select(User).filter_by(email='sjohnson@example.com')).scalar_one_or_none()
            assert new_user is None
        assert res.json == {
            'errors': {
                'email': ['Invalid email address.'],
                'password': ['Passwords must match']
            }
        }

    def test_register_existing_user(self, client, app):
        res = client.post('/users/register', data={
            'name': 'Jane Smith',
            'email': 'jsmith@example.com',
            'password': 'bpl psa is great',
            'confirm': 'bpl psa is great'
        })
        assert res.status_code == 400
        with app.app_context():
            new_users = db.session.execute(db.select(User).filter_by(email='jsmith@example.com')).all()
            assert len(new_users) == 1
        assert res.json == {
            'error': 'An account already exists for this user.'
        }