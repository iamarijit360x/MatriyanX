# app/controllers/patient_controller.py
from flask import jsonify, request
from ..validators import validate_patient_data
from app.database import get_db,close_db
from ..services.auth_service import AuthService
from ..services.patient_service import PatientService

auth_service=AuthService()
patient_service=PatientService()

@auth_service.token_check
def create_patient(user):
    data=request.get_json()
   
    error = validate_patient_data(data) #Check if data is valid or not
    if error:
        obj={'error':error,'message':'Please Enter Valid Data'}
        return jsonify(str(obj)), 400

    patient_service.create_patients(data,user['id'])
    return jsonify({'status':'ok'}),200

@auth_service.token_check
def get_patients(user):
    time_group =  request.args.get('time_group')
    if(time_group==''):
        return jsonify({"message":"Something Went Wrong","error":"Params Missing"}),400
    data=patient_service.get_patients(user['id'],time_group)
    return jsonify(data),200


    


    

