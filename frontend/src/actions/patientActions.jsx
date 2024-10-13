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
        const response = await axiosInstance.get(`http://localhost:5000/patient?time_group=${timegroup}`)
        return response.data
    } catch (error) {
        console.error('An error occurred during creating patient:', error);
    }
  
  };
