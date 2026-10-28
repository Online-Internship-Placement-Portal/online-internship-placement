/**
 * Authentication Middleware
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Requirement Traceability: IPR-SR-001, IPR-SR-003, TC-Auth-02, TC-Sec-01
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'portal_jwt_secret_key_development_pes_2026';

/**
 * Middleware to verify JWT authentication token
 * Ensures only authenticated users can access protected routes (IPR-SR-001 / TC-Sec-01)
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.',
      statusCode: 401
    });
  }

  // Token format expected: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token format. Expected "Bearer <token>".',
      statusCode: 401
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains { id, email, role, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token.',
      statusCode: 401,
      error: error.message
    });
  }
};

module.exports = {
  authenticateToken,
  JWT_SECRET
};
