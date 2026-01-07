from flask_wtf import FlaskForm
from wtforms.fields.simple import StringField, EmailField, PasswordField
from wtforms.validators import DataRequired, Length, Email, EqualTo


class UserForm(FlaskForm):
    name = StringField(validators=[DataRequired()])
    email = EmailField(validators=[DataRequired(), Email()])
    password = PasswordField(
        validators=[DataRequired(), Length(min=12, message='Password must be at least 12 characters'),
                    EqualTo('confirm', message='Passwords must match')])
    confirm = PasswordField(validators=[DataRequired()])
