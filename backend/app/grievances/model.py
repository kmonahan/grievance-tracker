from extensions import db

class Grievance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), unique=False, nullable=True)
    category = db.relationship('Category', back_populates='grievances')
    status_id = db.Column(db.Integer, db.ForeignKey('status.id'), unique=False, nullable=False)
    status = db.relationship('Status', back_populates='grievances')
    point_person_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=False, nullable=True)
    point_person = db.relationship('User', back_populates='grievances')

    def to_dict(self):
        grievance_dict = {column.name: getattr(self, column.name) for column in self.__table__.columns}
        grievance_dict['category'] = self.category.name if self.category else None
        del grievance_dict['category_id']
        grievance_dict['status'] = self.status.name if self.status else None
        del grievance_dict['status_id']
        grievance_dict['point_person'] = self.point_person.name if self.point_person else None
        del grievance_dict['point_person_id']
        return grievance_dict