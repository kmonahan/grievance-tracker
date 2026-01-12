from wtforms.fields.simple import PasswordField
from wtforms.validators import DataRequired, Length, EqualTo

from users.EditUserForm import EditUserForm


class UserForm(EditUserForm):
    password = PasswordField(
        validators=[DataRequired(), Length(min=12, message='Password must be at least 12 characters'),
                    EqualTo('confirm', message='Passwords must match')])
    confirm = PasswordField(validators=[DataRequired()])
