# app/controllers/user_controller.py
from flask import jsonify, request
from ..validators import validate_user_data
from app.database import get_db,close_db
from flask import send_file
from ..services.summary_service import SummaryService
from ..services.auth_service import AuthService
from ..services.patient_service import PatientService
from ..services.excel_service import ExcelService
auth_service=AuthService()
summary_service= SummaryService()
patient_service=PatientService()
excelService=ExcelService()
@auth_service.token_check
def create_summary(user):
    try:
        # Extract the JSON data from the request
        data = request.get_json()
        user_id = user['id']

        # Validate the data
        if not data or 'time_group' not in data :
            return jsonify({"error": "Invalid input data"}), 400

        # Call the service to create the summary
        summary_service.create_summary(data, user_id)

        return jsonify({"message": "Summary created successfully"}), 201

    except ValueError as e:
        return jsonify({"message":"Summary Already Exists","error": str(e)}), 429
    except Exception as e:
       return jsonify({"message": "An error occurred","error":str(e)}), 500
@auth_service.token_check
def get_all_summaries(user):
    try:
        user_id = user['id']
        # Call the service to create the summary
        summaries=summary_service.get_summaries_by_user(user_id)

        return jsonify({'data':summaries}), 200
    except Exception as e:

        return jsonify({"message": "An error occurred","error":str(e)}), 500
@auth_service.token_check
def get_summary_by_time_group(user,time_group):
    try:
        #time_group =  request.args.get('time_group')
        user_id = user['id']
        # Call the service to create the summary
        summaries=summary_service.get_summary(time_group,user_id)

        return jsonify(summaries), 200
    except Exception as e:

        return jsonify({"message": "An error occurred","error":str(e)}), 500
@auth_service.token_check
def generate_summary_report(user,time_group):
    try:
       
        user_id = user['id']
        # Call the service to create the summary
        summaries=patient_service.get_patients(user_id,time_group)
        santizedData=excelService.data_sanitization(summaries)
        excel_file=excelService.generateExcel(santizedData,time_group)
        return send_file(excel_file, as_attachment=True, download_name="report.xlsx", mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    except Exception as e:
        return jsonify({"message": "An error occurred","error":str(e)}), 500