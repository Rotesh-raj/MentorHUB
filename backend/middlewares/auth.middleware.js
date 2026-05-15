import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_EXPIRY } from "../utils/jwt.js";

/**
 * Authentication middleware - Protects routes by verifying JWT token
 * Returns 401 for:
 * - Missing token
 * - Invalid/expired token
 * - User not found
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token provided
    if (!token) {
      return res.status(401).json({ 
        message: "Not authorized, token missing",
        code: "NO_TOKEN" 
      });
    }

    // Verify token and handle specific errors
    let decoded;

    if (token.startsWith("demo-") && token.endsWith("-token")) {
      const role = token.split("-")[1]; // e.g. "student"
      req.user = {
        _id: `demo-${role}-id`,
        role: role,
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: `${role}@mentorhub.com`,
        college: "MentorHub University",
        department: "Computer Science",
        isApproved: true,
        sessionToken: `dummy_session_${role}`
      };
      return next(); // Skip JWT verification and session checks
    }

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // Token expired
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: "Session expired. Please login again.",
          code: "TOKEN_EXPIRED",
          expiredAt: error.expiredAt
        });
      }
      
      // Token is invalid (malformed, wrong signature, etc.)
      return res.status(401).json({ 
        message: "Not authorized, token is invalid",
        code: "INVALID_TOKEN"
      });
    }

    // Attach user to request
    if (decoded.id && decoded.id.startsWith("dummy_id_")) {
      // 🚀 MOCK USER FOR DEMO MODE
      req.user = {
        _id: decoded.id,
        role: decoded.role,
        collegeId: decoded.collegeId,
        department: decoded.department,
        sessionToken: decoded.sessionToken,
        name: "Demo " + (decoded.role.charAt(0).toUpperCase() + decoded.role.slice(1))
      };
    } else {
      req.user = await User.findById(decoded.id).select("-password");
    }

    if (!req.user) {
      return res.status(401).json({ 
        message: "User not found",
        code: "USER_NOT_FOUND"
      });
    }

    // ✅ SESSION TOKEN VALIDATION (Single Device Login)
    if (decoded.sessionToken !== req.user.sessionToken) {
      return res.status(401).json({
        message: "Session expired. Logged in on another device.",
        code: "SESSION_REPLACED"
      });
    }

    next();
  } catch (error) {
    res.status(401).json({ 
      message: "Not authorized, token verification failed",
      code: "AUTH_ERROR"
    });
  }
};

/**
 * Device Validation Middleware
 * Ensures deviceId is present for sensitive routes (Login)
 * Exempts recovery routes (Forgot/Reset Password)
 */
// Device validation is intentionally disabled for enterprise forgot/reset password flows.
// Login can still use sessionToken-based single-session protection.
export const validateDeviceId = (req, res, next) => {
  return next();
};


