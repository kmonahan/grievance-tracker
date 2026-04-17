from flask_wtf import FlaskForm
from wtforms.fields.datetime import DateField
from wtforms.fields.simple import StringField
from wtforms.validators import DataRequired


class HolidayForm(FlaskForm):
    name = StringField(validators=[DataRequired()])
    date = DateField(validators=[DataRequired()])