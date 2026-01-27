// src/utils/axiosInstance.js
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: apiUrl,
    // You can add default timeouts here
    // timeout: 10000, 
});

// Request Interceptor: Automatically adds the Token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accesstoken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Default Content-Type (can be overridden for images)
        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Optional (Global Error Handling)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized globally (e.g., logout user)
        if (error.response && error.response.status === 401) {
            // Optional: localStorage.clear(); window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;