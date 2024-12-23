from flask import request, jsonify
import jwt
import datetime
from functools import wraps
import os
import sqlitecloud
from app.database import get_db,close_db
class AuthService:
    def create_user(self,data):
        user_id=None
        db  = get_db()
        try:
            # Attempt to insert a new user
            cursor=db.execute('''
                INSERT INTO users (email, password)
                VALUES (?, ?)
            ''', ( data['email'], data['password']))
            user_id = cursor.lastrowid
            # Return the user_id
            db.commit()
            
        except sqlitecloud.IntegrityError:
            db.rollback()
            raise ValueError ('Email already exists')
        except sqlitecloud.Error as e:
            db.rollback()
            raise Exception(str(e)) 
        finally:
            close_db(db)
            return user_id if user_id else None
   
    def generate_set_refresh_token(self,user):
        db=get_db()
        refresh_token=self.generate_token(user,720*60*60)
        result = db.execute('''
            UPDATE users SET refresh_token = ? WHERE email = ?
        ''', (refresh_token, user['email']))
        close_db(db)
        return refresh_token

   
    def generate_token(self,user_obj,exp_hours=60*60*60*60):
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
            token = request.headers.get('Authorization')
            if not token:
                return jsonify({'error': 'Token is missing!'}), 403
            try:
                user = self.decode_token(token)
                if 'error' in user:

                    return jsonify(user), 403

            except Exception as e:
                return jsonify({'error': str(e)}), 403
            return f(user,*args, **kwargs)
        return decorated

    #TODO CREATE FUNCTION TO HASH AND VERIFY PASSWORD
    def hash_password(self):
        pass
    
    def verify_passwod(self):
        pass


