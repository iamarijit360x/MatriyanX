
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
export const signup = async (userData) => {
  try {
    const {email,password,submit,...accountData}=userData;
    const obj={email,password,
      accountData:{
        name:accountData.name,
        email: accountData.email,
        password:accountData.password,
        address:accountData.address ,
        district: accountData.district,
        block: accountData.block,
        vehicle_name:accountData.vehicleName ,
        vehicle_no: accountData.vehicleNo,
        vehicle_type: accountData.vehicleType,
        bmoh_email: accountData.BMOH
      }}
    
    const response = await axios.post(apiUrl+'/auth/signup', obj);
    console.log(response)
    return response.data;
 
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
