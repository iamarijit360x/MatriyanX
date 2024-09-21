from flask import Flask, request, jsonify
import jwt
import datetime
from functools import wraps
import os

def generate_token(email):
    """Generate a JWT token."""
    token = jwt.encode({
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expires in 1 hour
    }, os.getenv('SECRET_KEY'), algorithm='HS256')
    return token

def decode_token(token):
    """Decode a JWT token."""
    try:
        data = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        return data
    except jwt.ExpiredSignatureError:
        return {'error': 'Token has expired'}
    except jwt.InvalidTokenError:
        return {'error': 'Invalid token'}

def token_check(f):
    """Decorator to protect routes with JWT authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing!'}), 403
        try:
            decoded = decode_token(token)
            if 'error' in decoded:
                return jsonify(decoded), 403
            # You can also add more logic to set user info from token here
        except Exception as e:
            return jsonify({'error': str(e)}), 403
        return f(*args, **kwargs)
    return decorated



