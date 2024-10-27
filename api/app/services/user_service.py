# app/controllers/user_controller.py
from flask import jsonify, request
from ..validators import validate_user_data
import sqlitecloud
from app.database import get_db,close_db


class UserService:
        def get_user(self,email,password):
            try:
                db  = get_db()
                result=db.execute('''
                    SELECT * FROM users WHERE email = ? AND password = ?
                ''', (email, password))
                user = result.fetchone()
                if user is None:
                    return None  # No user found
                column_names = [description[0] for description in result.description]

                # Create a dictionary to represent the account object
                user = dict(zip(column_names, user))  # Create a dictionary mapping column names to values

            except sqlitecloud.Error as e:
                db.rollback()
                raise Exception(str(e)) 
            finally:
                close_db(db)
                return user
            
        def create_account(self,data,user_id):
            db  = get_db()
            try:
                # Attempt to insert a new user
                db.execute('''
                    INSERT INTO account (name,vehicle_name,vehicle_no,vehicle_type,district,block,bmoh_email,user_id)
                    VALUES (?,?,?,?,?,?,?,?)
                ''', ( data['name'],data['vehicle_name'],data['vehicle_no'],data['vehicle_type'],data['district'],data['block'],data['bmoh_email'],user_id))
                db.commit()
            except sqlitecloud.Error as e:
                db.rollback()
                raise Exception(str(e)) 
            finally:
                close_db(db)
        def get_account(self, user_id):
            db = None  # Initialize db to None
            account = None  # Initialize account to None

            try:
                db = get_db()
                result = db.execute('''
                    SELECT * FROM account WHERE user_id = ? 
                ''', (user_id,))  # Make sure to pass user_id as a tuple

                # Fetch the first matching account
                user = result.fetchone()
                if user is None:
                    return None  # No account found

                # Get column names from the cursor description
                column_names = [description[0] for description in result.description]

                # Create a dictionary to represent the account object
                account = dict(zip(column_names, user))  # Create a dictionary mapping column names to values

            except sqlitecloud.Error as e:
                if db:
                    db.rollback()  # Roll back the transaction on error
                raise Exception(str(e))
            
            finally:
                if db:
                    close_db(db)  # Close the database connection only if it was opened
            
            return account  # Return the account object (dictionary)
