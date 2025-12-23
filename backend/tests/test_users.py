from users.model import User


class TestUser:
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