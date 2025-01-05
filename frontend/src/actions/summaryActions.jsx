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
      return response.data.data;
   
    } catch (error) {
      console.error('An error occurred during signup:', error);
      return 'error';
    }
  };

  export const generateSummaryReport = async (time_group) => {
    try {
      const response = await axiosInstance.get(apiUrl+`/summary/generate-report/${time_group}`, {
        responseType: "blob", // Specify that the response should be a blob (binary data)
        headers: {
          "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Accept Excel file
        },
      });

      // Create a Blob from the response data
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a download link for the Blob data
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob); // Create a URL for the Blob
      link.download = "report.xlsx"; // Set the default file name
      link.click(); // Programmatically trigger the download     
   
    } catch (error) {
      console.error('An error occurred during signup:', error);
      return 'error';
    }
  };

  