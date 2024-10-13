import axiosInstance from "middlewares/axiosConfig";

const apiUrl = import.meta.env.VITE_API_URL;
export const createSummary = async (time_group) => {
  try {
    const response = await axiosInstance.post(apiUrl+'/summary', {
        time_group
    });
    return { message:response.data.message,status:response.status };
 
  } catch (error) {
    console.error('An error occurred during signup:', error);
    return { message:error.response.data.message,status:error.response.status };
  }
};

export const getAllSummaris = async () => {
    try {
      const response = await axiosInstance.get(apiUrl+'/summary');
      console.log(response.data.data)
      return { message:response.data.message,status:response.status };
   
    } catch (error) {
      console.error('An error occurred during signup:', error);
      return 'error';
    }
  };