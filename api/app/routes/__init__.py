# app/routes/__init__.py
from .auth_routes import auth_bp


def register_routes(app):
    app.register_blueprint(auth_bp)