from flask_wtf import FlaskForm
from wtforms.fields.choices import SelectField
from wtforms.fields.numeric import IntegerField
from wtforms.validators import DataRequired, Optional

from stages.DayTypes import DayTypes
from stages.Statuses import Statuses
from stages.Steps import Steps


class StageForm(FlaskForm):
    step = SelectField(choices=[(s.value, s.value) for s in Steps], validators=[DataRequired()])
    status = SelectField(choices=[(s.value, s.value) for s in Statuses], validators=[DataRequired()])
    num_days = IntegerField(validators=[Optional()])
    day_type = SelectField(choices=[('', '')] + [(d.value, d.name) for d in DayTypes], validators=[Optional()])
