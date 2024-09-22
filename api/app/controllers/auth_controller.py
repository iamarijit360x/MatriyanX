# app/controllers/user_controller.py
from flask import jsonify, request
from ..validators import validate_user_data
import sqlitecloud
from app.database import get_db,close_db
from ..services.user_service import userService
from ..services.auth_service import AuthService





auth_service=AuthService()
def create_user():
    data = request.get_json() #get user data from the request body
    error = validate_user_data(data) #Check if data is valid or not
    if error:
        obj={'error':error,'message':'Invaid Email/Password'}
        return jsonify(obj), 400
    try:
         auth_service.create_user(data)
    except ValueError as e:
         return jsonify({'message':str(e)}), 409
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'message': str(e)}), 500


    return jsonify({"message": "User created successfully", "user": data}), 201

def signin():

    data = request.get_json() #get user data from the request body
    email = data.get('email')
    password=data.get('password')

    if(not(email) or not(password)):
        return jsonify({'error': 'User Email and Password are required!'}), 400
    try:
        user_service=userService()
        
        user=user_service.get_user(email,password)
        if(not(user)):
              return jsonify({'message':'Invalid Credentials'}), 401

        auth_service.generate_set_access_token(user)

        access_token = auth_service.generate_token(user)
        return jsonify({'token': access_token}), 200
        
    except Exception as error:
            print(error)  
            return jsonify({'message': "Internal Server Error",error:str(error)}), 500

@auth_service.token_check
def protected():
    """Protected route that requires a valid JWT."""
    return jsonify({'message': 'This is a protected route!'})

