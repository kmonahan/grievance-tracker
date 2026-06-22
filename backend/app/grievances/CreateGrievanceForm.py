from flask_wtf import FlaskForm
from wtforms.fields.choices import SelectField
from wtforms.fields.simple import StringField
from wtforms.validators import DataRequired, Length

from stages.Steps import Steps


class CreateGrievanceForm(FlaskForm):
    name = StringField(validators=[DataRequired(), Length(max=255)])
    description = StringField()
    category_id = SelectField(coerce=int)
    point_person_id = SelectField(coerce=int)
    user_id = SelectField(coerce=int)
    step = SelectField(choices=[(s.value, s.value) for s in Steps], validators=[DataRequired()], default=Steps.ONE.value)