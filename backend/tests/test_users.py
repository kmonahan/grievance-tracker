import pytest
from flask_jwt_extended import get_jti
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db
from users.Token import Token
from users.model import User


class TestUser:
    @pytest.mark.usefixtures("app")
    def test_to_json(self):
        user = User(id=1, name="Test", is_active=True)
        assert user.to_dict() == {'id': 1, 'name': 'Test', 'is_active': True}

    def test_get_all(self, client):
        res = client.get("/users")
        assert res.status_code == 200
        assert res.json['users'] == [
            {
                'id': 1,
                'name': 'Jane Smith',
                'is_active': True
            },
            {
                'id': 2,
                'name': 'John Doe',
                'is_active': True
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
            'name': 'Sarah Johnson',
            'is_active': True
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

    def test_login(self, client, app):
        with app.app_context():
            example_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            example_user.password = generate_password_hash('password123')
            db.session.commit()

        res = client.post('/users/login', data={
            'email': 'jsmith@example.com',
            'password': 'password123'
        })
        assert res.status_code == 200
        data = res.json
        assert data['access_token'] is not None
        assert data['refresh_token'] is not None
        with app.app_context():
            access_jti = get_jti(data['access_token'])
            assert access_jti is not None
            access_token = db.session.execute(db.select(Token).filter_by(jti=access_jti)).scalar_one_or_none()
            assert access_token is not None
            assert access_token.is_active == True
            refresh_jti = get_jti(data['refresh_token'])
            assert refresh_jti is not None
            refresh_token = db.session.execute(db.select(Token).filter_by(jti=refresh_jti)).scalar_one_or_none()
            assert refresh_token is not None
            assert refresh_token.is_active == True

    def test_login_wrong_password(self, client):
        res = client.post('/users/login', data={
            'email': 'jsmith@example.com',
            'password': 'bpl psa is great'
        })
        assert res.status_code == 401
        data = res.json
        assert data['error'] == 'Incorrect password. Please try again.'

    def test_login_inactive(self, client, app):
        with app.app_context():
            example_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            example_user.password = generate_password_hash('password123')
            example_user.is_active = False
            db.session.commit()

        res = client.post('/users/login', data={
            'email': 'jsmith@example.com',
            'password': 'password123'
        })
        assert res.status_code == 403
        data = res.json
        with pytest.raises(KeyError, match='access_token'):
            var = data['access_token']

    def test_logout(self, client, app):
        with app.app_context():
            example_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            example_user.password = generate_password_hash('password123')
            db.session.commit()

        res = client.post('/users/login', data={
            'email': 'jsmith@example.com',
            'password': 'password123'
        })
        token = res.json['access_token']
        res = client.delete('/users/logout', headers={
            "Authorization": f"Bearer {token}"
        })
        assert res.status_code == 204
        with app.app_context():
            jti = get_jti(token)
            token = db.session.execute(db.select(Token).filter_by(jti=jti)).scalar_one_or_none()
            assert token.is_active == False

    def test_edit_user(self, client, app):
        with app.app_context():
            example_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            example_user.password = generate_password_hash('password123')
            db.session.commit()
        res = client.patch('/users/edit/1', data={
            'email': 'jsmith@example.com',
            'name': 'Jane Lynn Smith'
        })
        assert res.status_code == 200
        with app.app_context():
            test_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            assert test_user.name == 'Jane Lynn Smith'
            assert check_password_hash(test_user.password, 'password123') == True
        assert res.json == {
            'id': 1,
            'name': 'Jane Lynn Smith',
            'is_active': True
        }

    def test_edit_user_invalid(self, client, app):
        res = client.patch('/users/edit/1', data={
            'email': 'jsmith@example.com',
            'name': ''
        })
        assert res.status_code == 400
        with app.app_context():
            test_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            assert test_user.name == 'Jane Smith'

    def test_edit_user_existing_email(self, client, app):
        res = client.patch('/users/edit/1', data={
            'email': 'jdoe@example.com',
            'name': 'Jane Smith'
        })
        assert res.status_code == 400
        with app.app_context():
            test_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            assert test_user.email == 'jsmith@example.com'

    def test_edit_user_password(self, client, app):
        res = client.patch('/users/edit/1', data={
            'email': 'jsmith@example.com',
            'name': 'Jane Smith',
            'password': 'password123456',
            'confirm': 'password123456'
        })
        assert res.status_code == 200
        with app.app_context():
            test_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            assert check_password_hash(test_user.password, 'password123456') == True

    def test_edit_password_invalid(self, client):
        res = client.patch('/users/edit/1', data={
            'email': 'jsmith@example.com',
            'name': 'Jane Smith',
            'password': 'p123',
            'confirm': 'password123'
        })
        assert res.status_code == 400
        assert res.json['errors'] == {
            'password': ['Password must be at least 12 characters', 'Passwords must match']
        }
        res = client.patch('/users/edit/1', data={
            'email': 'jsmith@example.com',
            'name': 'Jane Smith',
            'password': 'password123456',
        })
        assert res.status_code == 400
        assert res.json['errors'] == {
            'password': ['Passwords must match'],
            'confirm': ['Field is required']
        }

    def test_deactivate_user(self, client, app):
        with app.app_context():
            existing_token = Token(user_id=1, jti='test', is_active=True)
            db.session.add(existing_token)
            db.session.commit()

        res = client.patch('/users/deactivate/1')
        assert res.status_code == 204
        with app.app_context():
            test_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            assert test_user.is_active == False
            token = db.session.query(Token.is_active).filter_by(user_id=1).scalar()
            assert token == False

    def test_reactivate_user(self, client, app):
        with app.app_context():
            example_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            example_user.password = generate_password_hash('password123')
            example_user.is_active = False
            db.session.commit()

        res = client.patch('/users/reactivate/1')
        assert res.status_code == 204
        with app.app_context():
            test_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            assert test_user.is_active == True


    def test_refresh_token(self, client, app):
        with app.app_context():
            example_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            example_user.password = generate_password_hash('password123')
            db.session.commit()

        res = client.post('/users/login', data={
            'email': 'jsmith@example.com',
            'password': 'password123'
        })
        refresh_token = res.json['refresh_token']
        res = client.post('/users/refresh', headers={
            "Authorization": f"Bearer {refresh_token}"
        })
        assert res.status_code == 200
        data = res.json
        assert data['access_token'] is not None