# app/controllers/user_controller.py
from flask import jsonify, request
from ..validators import validate_user_data
from app.database import get_db,close_db
from ..services.auth_service import AuthService
auth_service=AuthService()

@auth_service.token_check
def protected():
    """Protected route that requires a valid JWT."""
    return jsonify({'message': 'This is a protected route!'})

