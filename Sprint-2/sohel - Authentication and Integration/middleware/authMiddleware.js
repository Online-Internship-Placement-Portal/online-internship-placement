/**
 * JWT Authentication Middleware (Sprint-2)
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Traceability: IPR-SR-001 (Protected APIs), TC-Sec-01, SAD Section 3.9
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pes_placement_jwt_secret_key_sprint2_2026';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Access denied. No authorization token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Authorization token has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid authorization token.'
    });
  }
};

module.exports = {
  authenticateToken,
  JWT_SECRET
};
