from flask import request, jsonify
from functools import wraps
import sqlitecloud
from app.database import get_db,close_db
from ..utils.utility import generate_patient_id
from datetime import datetime
class PatientService:
    def create_patients(self, data_list, user_id):
        db = get_db()
        try:
            # Prepare the data for bulk insertion
            print(data_list)
            entries_to_insert = [
                (
                    generate_patient_id([data["name"], data["village"], data["date"], data["voucher_number"]]), 
                    data["serial_no"],  # serial_no
                    data["name"],  # name
                    data["village"],  # village
                    data["district"],  # district
                    data["voucher_number"],  # voucher_number
                    data["voucher_type"],  # voucher_type
                    data["distance"],  # distance
                    # Ensure the date is in DATETIME format 'YYYY-MM-DD HH:MM:SS'
                     datetime.strptime(data["date"], "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%Y-%m-%d %H:%M:%S"),  # date
                    data["amount"],  # amount
                    user_id  # user_id
                )
                for data in data_list['patients']
            ]

            # Print each entry being inserted for verification
            for entry in entries_to_insert:
                print(entry)

            # Perform the bulk insertion using executemany
            db.executemany('''
                INSERT INTO Patients (patient_id, serial_no, name, village, district, voucher_number, voucher_type, distance, date, amount, user_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', entries_to_insert)

            db.commit()  # Commit after inserting all entries

        except sqlitecloud.IntegrityError as e:
            db.rollback()
            raise ValueError(f"Integrity error: {e}")
        except sqlitecloud.Error as e:
            print(e)
            db.rollback()
            raise Exception(f"Database error: {e}")
        finally:
            close_db(db)




    def edit_patient(self, updated_data,user_id):
            db = get_db()
            print(updated_data)
            try:
                x=db.execute('''
                    UPDATE Patients
                    SET name = ?, village = ?, district = ?, voucher_number = ?, 
                        distance = ?, date = ?, amount = ?, voucher_type = ?
                    WHERE patient_id = ? AND user_id= ?
                ''', (
                    updated_data['name'],
                    updated_data['village'],
                    updated_data['district'],
                    updated_data['voucher_number'],
                    updated_data['distance'],
                    updated_data['date'],
                    updated_data['amount'],
                    updated_data['voucher_type'],
                    updated_data['patient_id'],
                    user_id
                ))
                db.commit()
            except sqlitecloud.Error as e:
                db.rollback()
                raise Exception(f"Database error: {e}")
            finally:
                close_db(db)
    def get_patients(self, user_id, date_range=None):
        db = get_db()
        try:
            # Prepare the SQL query
            query = 'SELECT * FROM Patients WHERE user_id = ?'
            params = [user_id]

            # If date_range is specified, add it to the query
            if date_range:
                start_date = date_range['start_date'] + ' 00:00:00'
                end_date = date_range['end_date'] + ' 23:59:59'
                query += ' AND date BETWEEN ? AND ?'
                params.extend([start_date, end_date])
                print("QUERY:", query)
                print("PARAMS:", params)

            else:
                # Default to the last 30 days if no date_range is provided
                query += ' AND date >= DATE("now", "-30 days")'

            # Execute the query
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
    
    def delete_patient(self, patient_id, user_id):
        db = get_db()
        try:
            # Prepare the data for bulk insertion
            # Print each entry being inserted for verification
            # Perform the bulk insertion using executemany
            db.execute('''
               DELETE FROM Patients WHERE user_id=? AND patient_id=?
            ''',(user_id,patient_id))
            
            db.commit()  # Commit after inserting all entries

        except sqlitecloud.IntegrityError as e:
            db.rollback()
            raise ValueError(f"Integrity error: {e}")
        except sqlitecloud.Error as e:
            db.rollback()
            raise Exception(f"Database error: {e}")
        finally:
            close_db(db)



