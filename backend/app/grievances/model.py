from extensions import db

class Grievance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), unique=False, nullable=True)
    category = db.relationship('Category', back_populates='grievances')

    def to_dict(self):
        grievance_dict = {column.name: getattr(self, column.name) for column in self.__table__.columns}
        grievance_dict['category'] = self.category.name if self.category else None
        del grievance_dict['category_id']
        return grievance_dict