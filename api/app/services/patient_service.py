from flask import request, jsonify
from functools import wraps
import sqlitecloud
from app.database import get_db,close_db
from ..utils.utility import generate_patient_id

class PatientService:
    def create_patients(self, data_list, user_id):
        db = get_db()
        try:
            # Prepare the data for bulk insertion
            entries_to_insert = [
                (
                    generate_patient_id([  data["name"],data["village"],data["date"],data["voucher_number"] ]), 
                    data["serial_no"],  # serial_no
                    data["time_group"],  # time_group
                    data["name"],  # name
                    data["village"],  # village
                    data["district"],  # district
                    data["voucher_number"],  # voucher_number
                    data["voucher_type"],  # voucher_type
                    data["distance"],  # distance
                    data["date"],  # date
                    data["amount"],  # amount
                    user_id  # user_id
                )
                for data in data_list['patients']
            ]

            # Print each entry being inserted for verification


            # Perform the bulk insertion using executemany
            db.executemany('''
                INSERT INTO Patients (patient_id, serial_no, time_group, name, village, district, voucher_number, voucher_type, distance, date, amount, user_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', entries_to_insert)
            db.execute('''
            UPDATE Summary
            SET total_amount = ?, distance = ?
            WHERE user_id = ? AND time_group = ?
        ''', (data_list['total_amount'], data_list['total_distance'], user_id, data_list['time_group']))
            
            db.commit()  # Commit after inserting all entries

        except sqlitecloud.IntegrityError as e:
            db.rollback()
            raise ValueError(f"Integrity error: {e}")
        except sqlitecloud.Error as e:
            db.rollback()
            raise Exception(f"Database error: {e}")
        finally:
            close_db(db)

   
    
    def edit_patient(self, patientID, updated_data,user_id):
            db = get_db()
            try:
                # Update patient details based on patientID
                db.execute('''
                    UPDATE Patients
                    SET name = ?, village = ?, district = ?, voucher_number = ?, 
                        Distance = ?, date = ?, amount = ?, voucher_type = ?
                    WHERE distance = ? AND user_id= ?
                ''', (
                    updated_data['name'],
                    updated_data['village'],
                    updated_data['district'],
                    updated_data['voucher_number'],
                    updated_data['distance'],
                    updated_data['date'],
                    updated_data['amount'],
                    updated_data['voucher_type'],
                    patientID,
                    user_id
                ))
                db.commit()
            except sqlitecloud.Error as e:
                db.rollback()
                raise Exception(f"Database error: {e}")
            finally:
                close_db(db)
    def get_patients(self, user_id, time_group=''):
        db = get_db()
        try:
            # Prepare the SQL query
            query = 'SELECT * FROM Patients WHERE user_id = ?'
            
            # If time_group is specified, add it to the query
            if not(time_group==''):
                query += ' AND time_group = ?'  # Assuming there is a 'time_group' column
                params = (user_id, time_group)
            else:
                params = (str(user_id))
            # Execute the query
            print(query,params)
            cursor = db.execute(query, params)
            rows = cursor.fetchall()  # Fetch all results
            
            # Get the column names from the cursor
            columns = [column[0] for column in cursor.description]

            # Convert each row to a dictionary (object-like)
            patients = [dict(zip(columns, row)) for row in rows]

            return patients  # Return the array of patient objects (dictionaries)
            
        except sqlitecloud.Error as e:
            db.rollback()  # Rollback in case of an error
            raise Exception(f"Database error: {e}")
        finally:
            close_db(db)  # Ensure the database connection is closed

    def create_summary(self, data, user_id):
        db = get_db()
        try:
            # Prepare the data for bulk insertion
            # Print each entry being inserted for verification
            # Perform the bulk insertion using executemany
            db.execute('''
                INSERT INTO SUMMARY  time_group,user_id)
                VALUES (?,?)
            ''',(data['time_group'],user_id))
            
            db.commit()  # Commit after inserting all entries

        except sqlitecloud.IntegrityError as e:
            db.rollback()
            raise ValueError(f"Integrity error: {e}")
        except sqlitecloud.Error as e:
            db.rollback()
            raise Exception(f"Database error: {e}")
        finally:
            close_db(db)


