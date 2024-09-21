from flask import Flask
from .routes import register_routes

def create_app():
    app = Flask(__name__)

    #SAMPLE TEST
    @app.route('/')
    def method_name():
        return 'Welcome to MatrianX API'
    
    register_routes(app)

    return app
