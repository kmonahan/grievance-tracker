from wtforms import PasswordField
from wtforms.validators import EqualTo, ValidationError

from users.UserForm import UserForm


def length_if_not_empty(min_length=12):
    def _length(form, field):
        if field.data and 0 < len(field.data) < min_length:
            raise ValidationError(f"Password must be at least {min_length} characters")

    return _length


def required_if_password_not_empty(form, field):
    if form.password.data and 0 < len(form.password.data) and (field.data is None or len(field.data) == 0):
        raise ValidationError("Field is required")


class EditUserForm(UserForm):
    password = PasswordField(
        validators=[length_if_not_empty(),
                    EqualTo('confirm', message='Passwords must match')])
    confirm = PasswordField(validators=[required_if_password_not_empty])
