from cerberus import Validator

# Define the validation schema for patient data
patient_schema = {
    'serial_no': {'type': 'integer', 'min': 1, 'required': True},
    'time_group': {'type': 'string', 'allowed': ['Morning', 'Afternoon', 'Evening'], 'required': True},
    'name': {'type': 'string', 'minlength': 1, 'maxlength': 50, 'required': True},
    'village': {'type': 'string', 'minlength': 1, 'maxlength': 50, 'required': True},
    'district': {'type': 'string', 'minlength': 1, 'maxlength': 50, 'required': True},
    'voucher_number': {'type': 'integer', 'required': True},
    'voucher_type': {'type': 'string', 'allowed': ['Government', 'Private'], 'required': True},
    'distance': {'type': 'float', 'min': 0, 'required': True},
    'date': {'type': 'string', 'regex': r'^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$', 'required': True},  # YYYY-MM-DD HH:MM:SS
    'amount': {'type': 'float', 'min': 0, 'required': True},
}

def validate_patient_data(data):
    v = Validator(patient_schema)
    errors = []

    # Check if the input data is a list
    if isinstance(data, list):
        for item in data:
            if not v.validate(item):
                errors.append(v.errors)
    else:
        # If it's not a list, validate it as a single document
        if not v.validate(data):
            errors.append(v.errors)

    return errors if errors else None
