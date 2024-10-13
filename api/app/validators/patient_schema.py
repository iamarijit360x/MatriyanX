from cerberus import Validator

# Define the validation schema for patient data
patient_schema = {
    'serial_no': {'type': 'integer', 'min': 1, 'required': True},
    'name': {'type': 'string', 'minlength': 1, 'maxlength': 50, 'required': True},
    'village': {'type': 'string', 'minlength': 1, 'maxlength': 50, 'required': True},
    'district': {'type': 'string', 'minlength': 1, 'maxlength': 50, 'required': True},
    'voucher_number': {'type': 'integer', 'required': True},
    'voucher_type': {'type': 'string', 'allowed': ['V1', 'V2','V3'], 'required': True},
    'distance': {'type': 'integer', 'min': 0, 'required': True},
    'date': {'required': True},  # YYYY-MM-DD HH:MM:SS
    'amount': {'type': 'integer', 'min': 0, 'required': True},
    'isEditing':{}
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
