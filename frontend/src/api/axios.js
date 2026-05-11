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
      // Get the error code from backend response
      const errorCode = error.response?.data?.code;
      
      // Determine redirect path based on user role
      const userStr = localStorage.getItem('user');
      let redirectPath = '/';
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          // Redirect to role-specific login page
          if (user.role === 'student') {
            redirectPath = '/student/login';
          } else if (user.role === 'teacher') {
            redirectPath = '/teacher/login';
          } else if (user.role === 'admin') {
            redirectPath = '/admin/login';
          }
        } catch (e) {
          // If parsing fails, default to root
          redirectPath = '/';
        }
      }
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Show alert for session expiry
      if (errorCode === 'SESSION_REPLACED') {
        alert("Your account was logged in on another device. For security reasons, this session has been ended.");
      } else if (errorCode === 'TOKEN_EXPIRED') {
        alert("Session expired. Please login again.");
      } else if (errorCode === 'NO_TOKEN' || errorCode === 'INVALID_TOKEN' || errorCode === 'USER_NOT_FOUND') {
        alert("Session expired. Please login again.");
      }
      
      // Redirect to login page
      window.location.href = redirectPath;
    }
    return Promise.reject(error);
  }
);

export default api;