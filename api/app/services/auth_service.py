from flask import request, jsonify
import jwt
import datetime
from functools import wraps
import os
import sqlitecloud
from app.database import get_db,close_db
class AuthService:
    def create_user(self,data):
        db  = get_db()
        try:
            # Attempt to insert a new user
            db.execute('''
                INSERT INTO users (email, password)
                VALUES (?, ?)
            ''', ( data['email'], data['password']))
            db.commit()
        except sqlitecloud.IntegrityError:
            db.rollback()
            raise ValueError ('Email already exists')
        except sqlitecloud.Error as e:
            db.rollback()
            raise Exception(str(e)) 
        finally:
            close_db(db)
    def generate_set_access_token(self,user):
        db=get_db()
        refresh_token=self.generate_token(user,720*60*60)
        result = db.execute('''
            UPDATE users SET refresh_token = ? WHERE email = ?
        ''', (refresh_token, user['email']))
        close_db(db)

    def generate_token(self,user_obj,exp_hours=20):
        """Generate a JWT token."""
        token = jwt.encode({
            'id':user_obj['id'],
            'email': user_obj['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=exp_hours)  # Token expires in 1 hour
        }, os.getenv('SECRET_KEY'), algorithm='HS256')
        return token
    def decode_token(self,token):
        """Decode a JWT token."""
        try:
            data = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
            return data
        except jwt.ExpiredSignatureError:
            return {'error': 'Token has expired'}
        except jwt.InvalidTokenError:
            return {'error': 'Invalid token'}

    def token_check(self,f):
        """Decorator to protect routes with JWT authentication."""  
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization_Refresh')
            if not token:
                return jsonify({'error': 'Token is missing!'}), 403
            try:
                decoded = self.decode_token(token)
                print(decoded)
                if 'error' in decoded:

                    return jsonify(decoded), 403

            except Exception as e:
                return jsonify({'error': str(e)}), 403
            return f(*args, **kwargs)
        return decorated

    #TODO CREATE FUNCTION TO HASH AND VERIFY PASSWORD
    def hash_password(self):
        pass
    def verify_passwod(self):
        pass


