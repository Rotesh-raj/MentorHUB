import jwt from 'jsonwebtoken';

// JWT Configuration
const JWT_EXPIRY = process.env.JWT_EXPIRE || '7d'; // Default: 7 days for production
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRE || '7d'; // Refresh token: 7 days

/**
 * Generate JWT access token
 * @param {string} id - User ID
 * @param {string} role - User role (student, teacher, admin)
 * @param {string} collegeId - User college ID
 * @param {string} department - User department
 * @param {string} sessionToken - Unique session token
 * @returns {string} JWT token
 */
export const generateToken = (id, role, collegeId, department, sessionToken) => {
  return jwt.sign(
    { id, role, collegeId, department, sessionToken },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

/**
 * Generate refresh token for longer sessions
 * @param {string} id - User ID
 * @returns {string} Refresh token with 7 days expiration
 */
export const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRY }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {object} Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(
    token, 
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
  );
};

/**
 * Decode token without verification (for extracting payload)
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

export { JWT_EXPIRY };
