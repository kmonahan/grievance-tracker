from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length


class CreateCategoryForm(FlaskForm):
    name = StringField(validators=[DataRequired(), Length(max=255)])
