import sqlitecloud
from app.database import get_db,close_db

class SummaryService:
    def create_summary(self, data, user_id):
        print(data)
        db = get_db()
        try:
            # Insert data into the SUMMARY table
            db.execute('''CREATE TABLE IF NOT EXISTS SUMMARY (
            time_group TEXT NOT NULL,
            total_patients INTEGER NOT NULL,
            distance INTEGER NOT NULL,
            total_amount INTEGER NOT NULL,
            status TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            PRIMARY KEY (time_group, user_id),  -- Composite primary key
            FOREIGN KEY (user_id) REFERENCES users(id)  -- Foreign key to user table
        );''')
            db.execute('''
            INSERT INTO SUMMARY (time_group, total_patients, distance, total_amount, user_id, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['time_group'], 
           0, 
            0, 
           0, 
            user_id, 
            "Created"
        ))
        
            
            db.commit()  # Commit the transaction after insertion

        except sqlitecloud.IntegrityError as e:
            db.rollback()  # Rollback if there's an integrity error
            print('INTEGRITY')
            raise ValueError(f"Integrity error: {e}")
        except sqlitecloud.Error as e:
            db.rollback()  # Rollback for general database errors
            raise Exception(f"Database error: {e}")
        finally:
            close_db(db)  # Ensure the database connection is closed

    def get_summaries_by_user(self, user_id):
        db = get_db()
        try:
            # Query to fetch all summaries where user_id matches the given one
            summaries = db.execute('''
                SELECT * FROM SUMMARY WHERE user_id = ?
            ''', (user_id,)).fetchall()
            
            # Convert the result to a list of dictionaries for easier handling
            summary_list = [
                dict(row) for row in summaries
            ]
            print(summary_list)
            return summary_list

        except sqlitecloud.Error as e:
            raise Exception(f"Database error: {e}")
        finally:
            close_db(db)
    def get_summary(self, time_group,user_id):
        db = get_db()
        print(time_group,user_id)
        try:
            # Prepare the SQL query to get the summary for the given user_id and time_group
            query = '''
                SELECT * FROM SUMMARY WHERE time_group = ? AND user_id = ?
            '''
            
            # Execute the query with parameters
            params = (time_group, user_id)
            print(query, params)  # Debugging print to check the query and parameters
            cursor = db.execute(query, params)
            
            # Fetch the result (summary) from the database
            row = cursor.fetchone()

            # If no summary is found, raise an exception
            if not row:
                raise Exception("No Data Found")

            # Get the column names from the cursor metadata
            columns = [column[0] for column in cursor.description]

            # Convert the result row to a dictionary using the column names
            summary = dict(zip(columns, row))

            print(summary)  # Debugging print to check the formatted result
            return summary  # Return the summary object as a dictionary

        except sqlitecloud.Error as e:
            raise Exception(f"Database error: {e}")
        finally:
            close_db(db)

