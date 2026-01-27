// src/utils/apiUtils.js
import axiosInstance from './axiosInstance';

// Helper function to format errors consistently
const handleError = (error, actionName) => {
    console.error(`Error ${actionName}:`, error);
    
    if (error.response && error.response.data) {
        return error.response.data;
    }

    return {
        error: true,
        success: false,
        message: error.message || "Network error occurred"
    };
};

export const postData = async (url, formData) => {
    try {
        // Headers are handled by axiosInstance
        const response = await axiosInstance.post(url, formData);
        return response.data;
    } catch (error) {
        return handleError(error, "posting data");
    }
};

export const fetchDataFromApi = async (url) => {
    try {
        // Simplified: removed manual headers/params
        const { data } = await axiosInstance.get(url);
        return data;
    } catch (error) {
        return handleError(error, "fetching data");
    }
};

export const uploadImage = async (url, formData) => {
    try {
        // We ONLY need to override Content-Type for images.
        // Authorization is still handled by the interceptor.
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        
        const response = await axiosInstance.put(url, formData, config);
        return response.data; // Return .data to match other functions

    } catch (error) {
        return handleError(error, "editing profile image");
    }
};

export const editData = async (url, updatedData) => {
    try {
        // Removed manual headers
        const response = await axiosInstance.put(url, updatedData);
        return response.data;
    } catch (error) {
        return handleError(error, "editing data");
    }
};

export const deleteData = async (url) => {
    try {
        // Removed manual headers
        const response = await axiosInstance.delete(url);
        return response.data;
    } catch (error) {
        return handleError(error, "deleting data");
    }
};