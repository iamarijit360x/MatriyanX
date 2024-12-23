# app/routes/user_routes.py
from flask import Blueprint
from app.controllers.patient_controller import create_patient,get_patients,edit_patient,delete_patient
# Create a blueprint for user-related routes
patient_bp = Blueprint('user_bp', __name__, url_prefix='/patient')
patient_bp.route('/', methods=['POST'])(create_patient)
patient_bp.route('/', methods=['GET'])(get_patients)
patient_bp.route('/', methods=['PUT'])(edit_patient)
patient_bp.route('/<patient_id>', methods=['DELETE'])(delete_patient)



