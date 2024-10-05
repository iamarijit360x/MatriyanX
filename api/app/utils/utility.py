import json
import hashlib

def generate_patient_id(arr):
    # Serialize the array to a JSON string
    json_string = json.dumps(arr, sort_keys=True)
    
    # Create a SHA-256 hash from the string
    hash_object = hashlib.sha256(json_string.encode('utf-8'))
    hash_hex = hash_object.hexdigest()
    
    # Take the first 7 characters of the hash
    short_string = hash_hex[:7]
    
    return short_string