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
    req.user = await User.findById(decoded.id).select("-password");

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
