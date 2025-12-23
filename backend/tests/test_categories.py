from categories.model import Category


class TestCategories:
    def test_to_json(self):
        category = Category(id=1, name="Test")
        assert category.to_dict() == {'id': 1, 'name': 'Test'}

    def test_get_all(self, client):
        res = client.get("/categories")
        assert res.status_code == 200
        assert res.json['categories'] == [
            {
                'id': 1,
                'name': 'Pay/PTO'
            },
            {
                'id': 2,
                'name': 'Failure to Bargain'
            },
            {
                'id': 3,
                'name': 'Health & Safety',
            },
            {
                'id': 4,
                'name': 'Scheduling & Overtime'
            },
            {
                'id': 5,
                'name': 'Union Busting'
            },
            {
                'id': 6,
                'name': 'Other'
            }]

    def test_get_grievances(self, client):
        res = client.get("/categories/1/grievances")
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