# app/controllers/patient_controller.py
from flask import jsonify, request
from ..validators import validate_patient_data
from app.database import get_db,close_db
from ..services.auth_service import AuthService
from ..services.patient_service import PatientService
from ..services.summary_service import SummaryService
auth_service=AuthService()
patient_service=PatientService()
summary_service=SummaryService()

@auth_service.token_check
def create_patient(user):
    data=request.get_json()
   
    error = validate_patient_data(data['patients']) #Check if data is valid or not
    if error:
        obj={'error':error,'message':'Please Enter Valid Data'}
        return jsonify(str(obj)), 400

    patient_service.create_patients(data,data['timegroup'],user['id'])
    summary_service.update_summary(data['timegroup'],user['id'])
    return jsonify({'status':'ok'}),200

@auth_service.token_check
def get_patients(user):
    time_group =  request.args.get('time_group')
    if(time_group==''):
        return jsonify({"message":"Something Went Wrong","error":"Params Missing"}),400
    data=patient_service.get_patients(user['id'],time_group)
    return jsonify(data),200


    

@auth_service.token_check
def edit_patient(user):
    data=request.get_json()
    filtered_patient = {k: v for k, v in data['patient'].items() if k not in ["time_group", "user_id", "patient_id"]}
    error = validate_patient_data(filtered_patient) #Check if data is valid or not
    if error:
        obj={'error':error,'message':'Please Enter Valid Data'}
        return jsonify(str(obj)), 400

    patient_service.edit_patient(data['patient'],user['id'])
    summary_service.update_summary(data['time_group'],user['id'])

    return jsonify({'status':'ok'}),200


    

@auth_service.token_check
def delete_patient(user,patient_id):
    timegroup =  request.args.get('timegroup')

    patient_service.delete_patient(patient_id,user['id'])
    summary_service.update_summary(timegroup,user['id'])

    return jsonify({'status':'ok'}),200
