from grievances.model import Grievance
from status.model import Status


class TestGrievances:
    def test_to_json(self):
        grievance = Grievance(id=1,
                              name="Test",
                              description="Asperiores magni aliquid quaerat deleniti repudiandae id odit et. Ducimus et voluptas doloribus nihil ut quo architecto ut. Laudantium dolorem sint voluptatum explicabo harum. Ea optio harum temporibus qui ut. Sint voluptatem rem voluptatem quisquam ut dolores. Placeat laborum explicabo vero delectus et modi. Soluta rerum dolorem molestias est. Ipsam culpa architecto earum maxime exercitationem. Voluptatum accusantium at quo libero deserunt aut est. Quod ut aut veritatis minus ut rerum beatae.",
                              status=Status(name='Test status'))
        assert grievance.to_dict() == {
            'id': 1,
            'name': 'Test',
            'description': 'Asperiores magni aliquid quaerat deleniti repudiandae id odit et. Ducimus et voluptas doloribus nihil ut quo architecto ut. Laudantium dolorem sint voluptatum explicabo harum. Ea optio harum temporibus qui ut. Sint voluptatem rem voluptatem quisquam ut dolores. Placeat laborum explicabo vero delectus et modi. Soluta rerum dolorem molestias est. Ipsam culpa architecto earum maxime exercitationem. Voluptatum accusantium at quo libero deserunt aut est. Quod ut aut veritatis minus ut rerum beatae.',
            'category': None,
            'status': 'Test status',
        }

    def test_get_all(self, client):
        res = client.get("/grievances/all")
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

