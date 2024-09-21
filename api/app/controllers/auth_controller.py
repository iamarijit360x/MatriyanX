# app/controllers/user_controller.py
from flask import jsonify, request
from ..validators import validate_user_data
import sqlitecloud
from app.database import get_db,close_db
from ..middlewares.auth_check import generate_token,token_check



def create_user():
    # Logic to create a new user
    data = request.get_json()
    # Validate the user data
    error = validate_user_data(data)
    if error:
        return jsonify(error), 400

    db  = get_db()
    try:
        # Attempt to insert a new user
        db.execute('''
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        ''', (data['username'], data['email'], data['password']))
        db.commit()
    except sqlitecloud.IntegrityError as e:
       
        db.rollback()
        return jsonify({'error': 'Username already exists'}), 400
         
    except sqlitecloud.Error as e:
       
        db.rollback()
      
        return jsonify({'error':e}), 401
    finally:
        close_db(db)

    return jsonify({"message": "User created successfully", "user": data}), 201

def signin():
    """Route to generate a JWT token after successful login."""
    data = request.get_json()
    # Example user authentication (in real applications, validate user credentials)
    email = data.get('email')
    password=data.get('password')

    if(not(email) or not(password)):
        return jsonify({'error': 'User ID is required!'}), 400
    db = get_db()

    try:
        result=db.execute('''
            SELECT * FROM users WHERE email = ? AND password_hash = ?
        ''', (email, password))
        user = result.fetchone()
        
        if user is None:
            return jsonify({'error': 'Invalid email or password'}), 401

        # Generate JWT token
        token = generate_token(email)
        return jsonify({'token': token}), 200
        
    except sqlitecloud.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        close_db(db)


@token_check
def protected():
    """Protected route that requires a valid JWT."""
    return jsonify({'message': 'This is a protected route!'})

