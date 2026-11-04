/**
 * Centralized Error Handling Middleware (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: SAD Section 4.4, IPR-NF-008 (Understandable Error Messages)
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode;
  if (statusCode === 200 || !statusCode) {
    statusCode = 500;
  }

  // Handle Mongoose duplicate key error (code 11000) -> 409 Conflict (SAD Section 4.4, IPR-F-009)
  if (err.code === 11000) {
    statusCode = 409;
    err.message = 'Conflict: Duplicate record detected. You have already submitted an application for this opportunity or this unique entity exists.';
  }

  // Handle Mongoose CastError (invalid ObjectId format) -> 400 Bad Request
  if (err.name === 'CastError') {
    statusCode = 400;
    err.message = `Resource not found with invalid identifier format: ${err.value}`;
  }

  // Handle Mongoose ValidationError -> 400 Bad Request
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map(val => val.message);
    err.message = messages.join('. ');
  }

  // Handle JWT Errors -> 401 Unauthorized
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    err.message = 'Invalid authorization token. Access denied.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    err.message = 'Authorization token has expired. Please log in again.';
  }

  console.error(`[Error] [${req.method} ${req.originalUrl}] Status: ${statusCode} - ${err.message}`);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
