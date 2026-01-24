from unittest.mock import patch

import pytest
from flask_jwt_extended import get_jti
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db
from users.Token import Token
from users.model import User


class TestUser:
    @pytest.mark.usefixtures("app")
    def test_to_json(self):
        user = User(id=1, name="A. Phillip Randolph", is_active=True)
        assert user.to_dict() == {'id': 1, 'name': 'A. Phillip Randolph', 'is_active': True}

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_get_all(self, _mock_verify_jwt, client):
        res = client.get("/users")
        assert res.status_code == 200
        assert res.json['users'] == [
            {
                'id': 1,
                'name': 'Walter Reuther',
                'is_active': True
            },
            {
                'id': 2,
                'name': 'Cesar Chavez',
                'is_active': True
            },
            {
                'id': 3,
                'name': 'Clara Lemlich',
                'is_active': True
            },
            {
                'id': 4,
                'name': 'Jimmy Hoffa',
                'is_active': False
            }
        ]

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_get_active(self, _mock_verify_jwt, client):
        res = client.get("/users/active")
        assert res.status_code == 200
        assert res.json['users'] == [
            {
                'id': 1,
                'name': 'Walter Reuther',
                'is_active': True
            },
            {
                'id': 2,
                'name': 'Cesar Chavez',
                'is_active': True
            },
            {
                'id': 3,
                'name': 'Clara Lemlich',
                'is_active': True
            },
        ]

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_register_user(self, _mock_verify_jwt, client, app):
        res = client.post('/users/register', data={
            'name': 'Mother Jones',
            'email': 'mjones@example.com',
            'password': 'bpl psa is great',
            'confirm': 'bpl psa is great'
        })
        assert res.status_code == 201
        with app.app_context():
            new_user = db.session.execute(db.select(User).filter_by(email='mjones@example.com')).scalar()
            assert new_user.id == 5
        assert res.json == {
            'id': 5,
            'name': 'Mother Jones',
            'is_active': True
        }

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_register_invalid_user(self, _mock_verify_jwt, client, app):
        res = client.post('/users/register', data={
            'name': 'Mother Jones',
            'email': 'mjones',
            'password': 'bpl psa is great',
            'confirm': 'bpl psa is great!'
        })
        assert res.status_code == 400
        with app.app_context():
            new_user = db.session.execute(db.select(User).filter_by(email='mjones@example.com')).scalar_one_or_none()
            assert new_user is None
        assert res.json == {
            'errors': {
                'email': ['Invalid email address.'],
                'password': ['Passwords must match']
            }
        }

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_register_existing_user(self, _mock_verify_jwt, client, app):
        res = client.post('/users/register', data={
            'name': 'Walter Reuther',
            'email': 'wreuther@example.com',
            'password': 'bpl psa is great',
            'confirm': 'bpl psa is great'
        })
        assert res.status_code == 400
        with app.app_context():
            new_users = db.session.execute(db.select(User).filter_by(email='wreuther@example.com')).all()
            assert len(new_users) == 1
        assert res.json == {
            'error': 'An account already exists for this user.'
        }

    def test_login(self, client, set_passwords):
        with set_passwords.app_context():
            example_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            example_user.password = generate_password_hash('password123')
            db.session.commit()

        res = client.post('/users/login', data={
            'email': 'wreuther@example.com',
            'password': 'password123'
        })
        assert res.status_code == 200
        data = res.json
        assert data['access_token'] is not None
        assert data['refresh_token'] is not None
        with set_passwords.app_context():
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
            'email': 'wreuther@example.com',
            'password': 'bpl psa is great'
        })
        assert res.status_code == 401
        data = res.json
        assert data['error'] == 'Incorrect password. Please try again.'

    @pytest.mark.usefixtures('set_passwords')
    def test_login_inactive(self, client):
        res = client.post('/users/login', data={
            'email': 'jhoffa@example.com',
            'password': 'password123'
        })
        assert res.status_code == 403
        data = res.json
        with pytest.raises(KeyError, match='access_token'):
            var = data['access_token']

    def test_logout(self, client, set_passwords):
        res = client.post('/users/login', data={
            'email': 'wreuther@example.com',
            'password': 'password123'
        })
        token = res.json['access_token']
        res = client.delete('/users/logout', headers={
            "Authorization": f"Bearer {token}"
        })
        assert res.status_code == 204
        with set_passwords.app_context():
            jti = get_jti(token)
            token = db.session.execute(db.select(Token).filter_by(jti=jti)).scalar_one_or_none()
            assert token.is_active == False

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_edit_user(self, _mock_verify_jwt, client, set_passwords):
        res = client.patch('/users/edit/1', data={
            'email': 'wreuther@example.com',
            'name': 'Walter Philip Reuther'
        })
        assert res.status_code == 200
        with set_passwords.app_context():
            test_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            assert test_user.name == 'Walter Philip Reuther'
            assert check_password_hash(test_user.password, 'password123') == True
        assert res.json == {
            'id': 1,
            'name': 'Walter Philip Reuther',
            'is_active': True
        }

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_edit_user_invalid(self, _mock_verify_jwt, client, app):
        res = client.patch('/users/edit/1', data={
            'email': 'wreuther@example.com',
            'name': ''
        })
        assert res.status_code == 400
        with app.app_context():
            test_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            assert test_user.name == 'Walter Reuther'

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_edit_user_existing_email(self, _mock_verify_jwt, client, app):
        res = client.patch('/users/edit/4', data={
            'email': 'wreuther@example.com',
            'name': 'Jimmy Hoffa'
        })
        assert res.status_code == 400
        with app.app_context():
            test_user = db.session.execute(db.select(User).filter_by(id=4)).scalar_one()
            assert test_user.email == 'jhoffa@example.com'

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_edit_user_password(self, _mock_verify_jwt, client, app):
        res = client.patch('/users/edit/2', data={
            'email': 'cchavez@example.com',
            'name': 'Cesar Chavez',
            'password': 'password123456',
            'confirm': 'password123456'
        })
        assert res.status_code == 200
        with app.app_context():
            test_user = db.session.execute(db.select(User).filter_by(id=2)).scalar_one()
            assert check_password_hash(test_user.password, 'password123456') == True

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_edit_password_invalid(self, _mock_verify_jwt, client):
        res = client.patch('/users/edit/2', data={
            'email': 'cchavez@example.com',
            'name': 'Cesar Chavez',
            'password': 'p123',
            'confirm': 'password123'
        })
        assert res.status_code == 400
        assert res.json['errors'] == {
            'password': ['Password must be at least 12 characters', 'Passwords must match']
        }
        res = client.patch('/users/edit/2', data={
            'email': 'cchavez@example.com',
            'name': 'Cesar Chavez',
            'password': 'password123456',
        })
        assert res.status_code == 400
        assert res.json['errors'] == {
            'password': ['Passwords must match'],
            'confirm': ['Field is required']
        }

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_deactivate_user(self, _mock_verify_jwt, client, app):
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

    @patch("flask_jwt_extended.view_decorators.verify_jwt_in_request")
    def test_reactivate_user(self, _mock_verify_jwt, client, app):
        res = client.patch('/users/reactivate/4')
        assert res.status_code == 204
        with app.app_context():
            test_user = db.session.execute(db.select(User).filter_by(id=1)).scalar_one()
            assert test_user.is_active == True


    @pytest.mark.usefixtures('set_passwords')
    def test_refresh_token(self, client):
        res = client.post('/users/login', data={
            'email': 'clemlich@example.com',
            'password': 'password123'
        })
        refresh_token = res.json['refresh_token']
        res = client.post('/users/refresh', headers={
            "Authorization": f"Bearer {refresh_token}"
        })
        assert res.status_code == 200
        data = res.json
        assert data['access_token'] is not None