# app/routes/user_routes.py
from flask import Blueprint
from app.controllers.auth_controller import create_user,protected,signin

# Create a blueprint for user-related routes
user_bp = Blueprint('user_bp', __name__, url_prefix='/user')

user_bp.route('/settings', methods=['PATCH'])
