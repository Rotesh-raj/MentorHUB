import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for auto-logout after token expiration
 * Monitors token expiration and automatically logs out user when token expires
 * 
 * @param {number} expirationTime - Token expiration time in seconds (default: 3600 = 1 hour)
 * @param {function} logout - Logout function from AuthContext
 */
const useTokenExpiration = (expirationTime = 3600, logout) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const logoutRef = useRef(logout);
  
  // Keep logout function ref updated
  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  const handleLogout = useCallback(() => {
    if (logoutRef.current) {
      logoutRef.current();
    }
    
    // Show alert
    alert("Session expired. Please login again.");
    
    // Redirect based on user role
    const userStr = localStorage.getItem('user');
    let redirectPath = '/';
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'student') {
          redirectPath = '/student/login';
        } else if (user.role === 'teacher') {
          redirectPath = '/teacher/login';
        } else if (user.role === 'admin') {
          redirectPath = '/admin/login';
        }
      } catch (e) {
        redirectPath = '/';
      }
    }
    
    navigate(redirectPath);
  }, [navigate]);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Don't set timer if no expiration time
    if (!expirationTime || expirationTime <= 0) {
      return;
    }

    // Set timer for token expiration (convert to milliseconds)
    const expirationMs = expirationTime * 1000;
    
    timerRef.current = setTimeout(() => {
      handleLogout();
    }, expirationMs);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [expirationTime, handleLogout]);

  // Return remaining time for UI display (optional)
  const getRemainingTime = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return 0;

    try {
      // Decode JWT to get expiration (without verification)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      
      if (expirationTime <= now) {
        return 0; // Token already expired
      }
      
      return Math.floor((expirationTime - now) / 1000); // Return seconds remaining
    } catch (e) {
      return 0;
    }
  }, []);

  return { getRemainingTime };
};

export default useTokenExpiration;
