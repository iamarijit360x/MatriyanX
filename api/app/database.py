# app/database.py
from flask import g
import sqlitecloud
import os

def get_db():
    """Establish and return a database connection, stored in the Flask app context."""
    if 'db' not in g:
        # Create a new database connection if it doesn't exist in the current context
        g.db = sqlitecloud.connect(os.getenv('DB_URL'))
        g.db.execute(f"USE DATABASE {os.getenv('DB_NAME')}")
    return g.db

def close_db(error):
    """Close the database connection at the end of the request context."""
    db = g.pop('db', None)

    if db is not None:
        db.close()
