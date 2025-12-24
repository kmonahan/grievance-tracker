from flask_wtf import FlaskForm
from wtforms.fields.choices import SelectField
from wtforms.fields.simple import StringField
from wtforms.validators import DataRequired, Length


class CreateGrievanceForm(FlaskForm):
    name = StringField(validators=[DataRequired(), Length(max=255)])
    description = StringField()
    category_id = SelectField(coerce=int)
    point_person_id = SelectField(coerce=int)