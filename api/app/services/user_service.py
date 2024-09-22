# app/controllers/user_controller.py
from flask import jsonify, request
from ..validators import validate_user_data
import sqlitecloud
from app.database import get_db,close_db


class userService:
        def get_user(self,email,password):
            db  = get_db()
            result=db.execute('''
                SELECT * FROM users WHERE email = ? AND password = ?
            ''', (email, password))
            user = result.fetchone()
            if user is None:
                return None  # No user found
            user_obj={
            'id':user[0],
            'email':user[1]
             }
            close_db(db)
            return user_obj
        
        
        
