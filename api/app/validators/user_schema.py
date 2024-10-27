from cerberus import Validator

user_schema = {
    'email': {
        'type': 'string', 
        'regex': r'^\S+@\S+\.\S+$', 
        'required': True
    },
    'password': {
        'type': 'string', 
        'minlength': 6, 
        'required': True
    },
    'accountData': {
        'type': 'dict', 
        'required': True,
        'schema': {
            'name': {'type': 'string', 'required': True},
            'address': {'type': 'string', 'required': True},
            'district': {'type': 'string', 'required': True},
            'block': {'type': 'string', 'required': True},
            'vehicle_name': {'type': 'string', 'required': True},
            'vehicle_no': {'type': 'string', 'required': True},
            'vehicle_type': {'type': 'string', 'required': True},
            'bmoh_email': {'type': 'string', 'required': True}
        }
    }
}

def validate_user_data(data):
    v = Validator(user_schema)
    if not v.validate(data):
        return v.errors
    return None
