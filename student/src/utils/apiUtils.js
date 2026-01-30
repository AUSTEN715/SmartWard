import axiosInstance from './axiosInstance';

// 1. Helper to dig through different error formats to find the REAL message
const getErrorMessage = (errorData) => {
  // Check if backend sent a simple message
  if (errorData.message) return errorData.message;

  // Check if backend sent an 'error' object/string
  if (errorData.error) return errorData.error;

  // Check if backend sent a validation array (common in Node/Express)
  // Example: { errors: [{ msg: "Invalid email" }, { msg: "Password too short" }] }
  if (errorData.errors && Array.isArray(errorData.errors)) {
    return errorData.errors.map(err => err.msg || err.message).join(', ');
  }

  // Fallback if nothing specific is found
  return "Unknown server error";
};

// 2. Main Error Handler
const handleError = (error, actionName) => {
    console.error(`Error ${actionName}:`, error);
    
    // CASE A: Server responded with a status code (400, 401, 500, etc.)
    if (error.response && error.response.data) {
        const serverMessage = getErrorMessage(error.response.data);
        return {
            success: false,
            message: serverMessage, // 🟢 This is the detailed text you want
            data: error.response.data
        };
    }

    // CASE B: No response (Network died, Server down)
    return {
        success: false,
        message: error.message || "Network error. Check your connection."
    };
};

// --- API FUNCTIONS ---

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
        // Force Content-Type for file uploads
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        // Using POST as per your backend route requirement
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

// Updated to accept 'config' so you can send passwords in delete requests
export const deleteData = async (url, config = {}) => {
    try {
        const response = await axiosInstance.delete(url, config);
        return response.data;
    } catch (error) {
        return handleError(error, "deleting data");
    }
};