import axiosInstance from "middlewares/axiosConfig";
import { formatDateForSQL } from "utils/utils";

const apiUrl = import.meta.env.VITE_API_URL;
export const createPatient  = async (patientData) => {
  try {
    const response = await axiosInstance.post(apiUrl+'/patient', patientData);
    console.log(response)
 
  } catch (error) {
    console.error('An error occurred during creating patient:', error);
    return { message:error.response.data.message,status:error.response.status };
  }
};

export const getAllPatients = async (startDate='',endDate='') => {
    try {
        const response = await axiosInstance.get(apiUrl+`/patient?start_date=${formatDateForSQL(startDate)}&end_date=${formatDateForSQL(endDate)}`);
        return response.data
    } catch (error) {
        console.error('An error occurred during creating patient:', error);
    }
  
  };


  export const editPatient  = async (patientData) => {
    try {
      const response = await axiosInstance.put(apiUrl+'/patient', patientData);
      console.log(response)
   
    } catch (error) {
      console.error('An error occurred during creating patient:', error);
      return { message:error.response.data.message,status:error.response.status };
    }
  };
  

  export const deletePatient  = async (patient_id) => {
    try {
      const response = await axiosInstance.delete(apiUrl+`/patient/${patient_id}`)
      console.log(response)
   
    } catch (error) {
      console.error('An error occurred during creating patient:', error);
      return { message:error.response.data.message,status:error.response.status };
    }
  };
  
