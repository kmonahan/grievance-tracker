from steps.model import Step


class TestStatus:
    def test_to_json(self):
        status = Step(id=1, name="Test")
        assert status.to_dict() == {'id': 1, 'name': 'Test'}

    def test_get_all(self, client):
        res = client.get("/steps")
        assert res.status_code == 200
        assert res.json['steps'] == [
            {
                'id': 1,
                'name': 'Step #1'
            },
            {
                'id': 2,
                'name': 'Step #2'
            },
            {
                'id': 3,
                'name': 'Step #3',
            }]
