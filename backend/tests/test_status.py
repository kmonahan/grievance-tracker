from status.model import Status


class TestStatus:
    def test_to_json(self):
        status = Status(id=1, name="Test")
        assert status.to_dict() == {'id': 1, 'name': 'Test'}

    def test_get_all(self, client):
        res = client.get("/status")
        assert res.status_code == 200
        assert res.json['status'] == [
            {
                'id': 1,
                'name': 'Waiting to File'
            },
            {
                'id': 2,
                'name': 'Waiting to Schedule'
            },
            {
                'id': 3,
                'name': 'Scheduled',
            },
            {
                'id': 4,
                'name': 'Waiting on Decision'
            },
            {
                'id': 5,
                'name': 'Resolved'
            },
            {
                'id': 6,
                'name': 'Denied'
            }]
