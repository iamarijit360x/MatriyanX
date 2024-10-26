import axiosInstance from "middlewares/axiosConfig";

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

export const getAllPatients = async (timegroup) => {
    try {
        const response = await axiosInstance.get(apiUrl+`/patient?time_group=${timegroup}`)
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
  

  export const deletePatient  = async (patient_id,time_group) => {
    try {
      const response = await axiosInstance.delete(apiUrl+`/patient/${patient_id}?timegroup=${time_group}`)
      console.log(response)
   
    } catch (error) {
      console.error('An error occurred during creating patient:', error);
      return { message:error.response.data.message,status:error.response.status };
    }
  };
  
