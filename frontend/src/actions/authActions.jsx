
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
export const signup = async (email, password) => {
  try {
    const response = await axios.post(apiUrl+'/auth/signup', {
      username: email,
      password: password,
    });
    return { message:response.data.message,status:response.status };
 
  } catch (error) {
    console.error('An error occurred during signup:', error);
    return { message:error.response.data.message,status:error.response.status };
  }
};
export const signin = async (email, password) => {
  try {
    const response = await axios.post(apiUrl+'/auth/signin', {
        email: email,
      password: password,
    });
    
    return {data:response.data,status:200};
 
  } catch (error) {
    console.error('An error occurred during signup:', error);
    return { message:error.response.data.message,status:error.response.status };
  }
};
