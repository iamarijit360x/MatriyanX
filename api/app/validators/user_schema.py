from cerberus import Validator

user_schema = {
    'email': {'type': 'string', 'regex': r'^\S+@\S+\.\S+$', 'required': True},
    'password': {'type': 'string', 'minlength': 6, 'required': True}
}



def validate_user_data(data):
    v = Validator(user_schema)
    if not v.validate(data):
        return v.errors
    return None

