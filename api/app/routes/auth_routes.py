# app/routes/user_routes.py
from flask import Blueprint
from app.controllers.auth_controller import create_user,protected,signin

# Create a blueprint for user-related routes
auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')

# Register routes to the blueprint
auth_bp.route('/', methods=['POST'])(create_user)
auth_bp.route('/signin', methods=['POST'])(signin)
auth_bp.route('/protected', methods=['GET'])(protected)

  