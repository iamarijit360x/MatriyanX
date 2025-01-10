from flask import Flask
from .routes import register_routes
from flask_cors import CORS
import os
def create_app():
    app = Flask(__name__)
    app.url_map.strict_slashes = False  # Disable redirect on missing slash
    # Allow CORS for all routes from specific origins
    CORS(app, origins=[os.getenv('FRONT_END_URL')], supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE"])

    # Sample test route
    @app.route('/')
    def welcome():
        return 'Welcome to MatrianX API'
    
    # Register additional routes
    register_routes(app)

    return app
