import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
});

// attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

  },

  (error) => Promise.reject(error)
);

/**
 * Response interceptor - Handles 401 errors (expired/invalid tokens)
 * Automatically logs out user and redirects to appropriate login page
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear localStorage on 401 to prevent stale data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Note: We don't use window.location.href here to avoid breaking React state/loops
      // The AuthContext checkAuth will handle the redirect if it fails
    }
    return Promise.reject(error);
  }
);

export default api;