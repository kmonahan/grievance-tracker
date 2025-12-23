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

    def test_get_grievances(self, client):
        res = client.get("/status/2/grievances")
        assert res.status_code == 200
        assert res.json['grievances'] == [
            {
                'id': 1,
                'name': 'Test #1',
                'description': 'Asperiores magni aliquid quaerat deleniti repudiandae id odit et. Ducimus et voluptas doloribus nihil ut quo architecto ut. Laudantium dolorem sint voluptatum explicabo harum. Ea optio harum temporibus qui ut. Sint voluptatem rem voluptatem quisquam ut dolores. Placeat laborum explicabo vero delectus et modi. Soluta rerum dolorem molestias est. Ipsam culpa architecto earum maxime exercitationem. Voluptatum accusantium at quo libero deserunt aut est. Quod ut aut veritatis minus ut rerum beatae.',
                'category': 'Pay/PTO',
                'status': 'Waiting to Schedule'
            },
        ]