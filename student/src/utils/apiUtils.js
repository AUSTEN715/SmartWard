import axiosInstance from './axiosInstance';

// Helper to extract the specific error message
const getErrorMessage = (errorData) => {
  // 1. If backend sends { message: "User exists" }
  if (errorData.message) return errorData.message;

  // 2. If backend sends { error: "User exists" }
  if (errorData.error) return errorData.error;

  // 3. If backend sends validation array { errors: [{ msg: "Invalid email" }] }
  if (errorData.errors && Array.isArray(errorData.errors)) {
    return errorData.errors.map(err => err.msg || err.message).join(', ');
  }

  // 4. Fallback
  return "Unknown server error";
};

const handleError = (error, actionName) => {
    console.error(`Error ${actionName}:`, error);
    
    // CASE 1: Server responded with a status code (4xx, 5xx)
    if (error.response && error.response.data) {
        const serverMessage = getErrorMessage(error.response.data);
        return {
            success: false,
            message: serverMessage, // We extract the REAL string here
            data: error.response.data // Keep original data just in case
        };
    }

    // CASE 2: No response (Network error, server down)
    return {
        success: false,
        message: error.message || "Network error. Check your connection."
    };
};

export const postData = async (url, formData) => {
    try {
        const response = await axiosInstance.post(url, formData);
        return response.data;
    } catch (error) {
        return handleError(error, "posting data");
    }
};

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axiosInstance.get(url);
        return data;
    } catch (error) {
        return handleError(error, "fetching data");
    }
};

export const uploadImage = async (url, formData) => {
    try {
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        const response = await axiosInstance.post(url, formData, config);
        return response.data;
    } catch (error) {
        return handleError(error, "uploading image");
    }
};

export const editData = async (url, updatedData) => {
    try {
        const response = await axiosInstance.put(url, updatedData);
        return response.data;
    } catch (error) {
        return handleError(error, "editing data");
    }
};

export const deleteData = async (url, config = {}) => {
    try {
        const response = await axiosInstance.delete(url, config);
        return response.data;
    } catch (error) {
        return handleError(error, "deleting data");
    }
};