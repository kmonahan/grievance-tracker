from extensions import db

class Grievance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), unique=False, nullable=True)
    category = db.relationship('Category', back_populates='grievances')
    point_person_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=False, nullable=True)
    point_person = db.relationship('User', back_populates='grievances')
    escalations = db.relationship('Escalation', back_populates='grievance', cascade='all, delete')

    def to_dict(self):
        grievance_dict = {column.name: getattr(self, column.name) for column in self.__table__.columns}
        grievance_dict['category'] = self.category.name if self.category else None
        del grievance_dict['category_id']
        grievance_dict['point_person'] = self.point_person.name if self.point_person else None
        del grievance_dict['point_person_id']
        grievance_dict['escalations'] = [escalation.to_dict() for escalation in self.escalations if self.escalations is not None]
        return grievance_dict