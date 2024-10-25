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
            total_distance INTEGER NOT NULL,
            total_amount INTEGER NOT NULL,
            status TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            PRIMARY KEY (time_group, user_id),  -- Composite primary key
            FOREIGN KEY (user_id) REFERENCES users(id)  -- Foreign key to user table
        );''')
            db.execute('''
            INSERT INTO SUMMARY (time_group, total_patients, total_distance, total_amount, user_id, status)
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
    def update_summary(self, data, time_group, user_id):
        db = get_db()
        try:
            # Check if only status is provided in the data
            if 'status' in data and len(data) == 1:
                # Update only the status column if that's the only key in data
                db.execute('''
                    UPDATE SUMMARY
                    SET status = ?
                    WHERE user_id = ? AND time_group = ?
                ''', (
                    data['status'],  # New status from data
                    user_id,         # User ID
                    time_group       # Time group
                ))
            else:
                # Update other columns if they are included in the data
                db.execute('''
                    UPDATE SUMMARY
                    SET total_patients = ?, total_distance = ?, total_amount = ?
                    WHERE user_id = ? AND time_group = ?
                ''', (
                    data.get('total_patients', 0), 
                    data.get('total_distance', 0),
                    data.get('total_amount', 0),
                    user_id,
                    time_group
                ))

            db.commit()  # Commit the transaction after updating

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
            cursor = db.execute('''
                SELECT * FROM SUMMARY WHERE user_id = ? ORDER BY time_group DESC
            ''', (user_id,))


            summaries=cursor.fetchall()
            # Get column names from the cursor
            print(cursor)
            columns = [column[0] for column in cursor.description]

            # Convert the result to a list of dictionaries for easier handling
            summary_list = [dict(zip(columns, row)) for row in summaries]

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

