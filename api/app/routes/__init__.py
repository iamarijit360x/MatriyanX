# app/routes/__init__.py
from .auth_routes import auth_bp
from .user_routes import user_bp
from .patient_routes import patient_bp
def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(patient_bp)