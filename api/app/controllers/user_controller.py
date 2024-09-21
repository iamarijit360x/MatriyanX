# app/controllers/user_controller.py
from flask import jsonify, request
from ..validators import validate_user_data
import sqlitecloud
from app.database import get_db,close_db
from ..middlewares.auth_check import generate_token,token_check



@token_check
def protected():
    """Protected route that requires a valid JWT."""
    return jsonify({'message': 'This is a protected route!'})

