import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import useTokenExpiration from "../hooks/useTokenExpiration";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // 🚀 SYNC INITIALIZATION: Prevents flash of unauth and redirect loops
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(true);
  const [tokenExpiresIn, setTokenExpiresIn] = useState(null);
  /* ================= LOGOUT ================= */
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Ignore error if already logged out or token invalid
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setTokenExpiresIn(null);
  }, []);

  /* ================= AUTO TOKEN EXPIRY ================= */
  useTokenExpiration(tokenExpiresIn, logout);

  /* ================= CHECK AUTH ON LOAD ================= */
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Verify with backend
          const response = await api.get("/auth/me");
          
          // Update state with fresh data from backend
          const userData = response.data;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
          console.warn("Auth validation failed:", error.response?.data?.message || error.message);
          // Only logout if it's a real 401 error, not a network error
          if (error.response?.status === 401) {
            logout();
          }
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, [logout]);

  /* ================= LOGIN ================= */
  const login = async (email, password) => {
    try {
      console.log(`Attempting login for: ${email}`);
      const response = await api.post("/auth/login", { email, password });

      const { token, user: userData, tokenExpiresIn: expiresIn } = response.data;
      
      console.log("✅ LOGIN SUCCESS:", response.data);
      console.log("User Role:", userData.role);
      console.log("Token:", token);

      // Explicitly construct safe user data to ensure no extra fields bloat localStorage
      const safeUserData = {
        _id: userData._id,
        name: userData.name,
        role: userData.role,
        college: userData.college,
        department: userData.department,
        year: userData.year,
        section: userData.section,
        referenceId: userData.referenceId,
        sessionToken: userData.sessionToken // 🔥 Important for dummy check
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(safeUserData));

      // Update React State immediately
      setUser(userData);
      setTokenExpiresIn(expiresIn || 3600);

      return userData; 
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("LOGIN FAILED:", errorMsg);
      throw error;
    }
  };

  /* ================= STUDENT REGISTER ================= */
  const studentRegister = async (data) => {
    const response = await api.post("/auth/student/register", data);

    const { token, user: userData, tokenExpiresIn: expiresIn } = response.data;

    const safeUserData = {
      _id: userData._id,
      name: userData.name,
      role: userData.role,
      college: userData.college,
      department: userData.department,
      year: userData.year,
      section: userData.section,
      referenceId: userData.referenceId
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(safeUserData));

    setUser(userData);
    setTokenExpiresIn(expiresIn || 3600);

    return userData;
  };

  /* ================= TEACHER REGISTER ================= */
  const teacherRegister = async (data) => {
    const response = await api.post("/auth/teacher/register", data);

    const { token, user: userData, tokenExpiresIn: expiresIn } = response.data;

    const safeUserData = {
      _id: userData._id,
      name: userData.name,
      role: userData.role,
      college: userData.college,
      department: userData.department,
      referenceId: userData.referenceId
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(safeUserData));

    setUser(userData);
    setTokenExpiresIn(expiresIn || 3600);

    return userData;
  };

  /* ================= ADMIN REGISTER ================= */
  // ✅ Now forwards college + department + role
  const register = async (name, email, password, confirmPassword, college, department, role) => {
    try {
      const response = await api.post("/auth/admin/register", {
        name,
        email,
        password,
        confirmPassword,
        college,
        department,
        role,
      });

      return response.data; // 🔥 Return success message
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error.message);
      throw error;
    }
  };

  /* ================= CONTEXT VALUE ================= */
  const value = {
    user,
    loading,
    login,
    register,
    studentRegister,
    teacherRegister,
    logout,
    isAuthenticated: !!user,
    isStudent: user?.role === "student",
    isTeacher: user?.role === "teacher",
    isAdmin: user?.role === "admin",
    isSuperAdmin: user?.role === "superadmin", // 🔥 ADDED
    updateUser: (data) => {
      setUser(prev => ({ ...prev, ...data }));
      const currentLocal = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...currentLocal, ...data }));
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};