from flask_wtf import FlaskForm
from wtforms.fields.choices import SelectField
from wtforms.fields.simple import StringField
from wtforms.validators import DataRequired, Length

from stages.Steps import Steps

def coerce_optional_id(value):
    if value == '' or value is None:
        return None
    return int(value)

class CreateGrievanceForm(FlaskForm):
    name = StringField(validators=[DataRequired(), Length(max=255)])
    description = StringField()
    category_id = SelectField(coerce=coerce_optional_id)
    point_person_id = SelectField(coerce=coerce_optional_id)
    secondary_id = SelectField(coerce=coerce_optional_id)
    user_id = SelectField(coerce=coerce_optional_id, validators=[DataRequired()])
    step = SelectField(choices=[(s.value, s.value) for s in Steps], validators=[DataRequired()], default=Steps.ONE.value)