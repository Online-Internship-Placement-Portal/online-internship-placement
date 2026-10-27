/**
 * Request Logging Middleware
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: SAD Section 4.4 (Logging & Monitoring)
 */

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const color = statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, Green for OK
    const reset = '\x1b[0m';
    console.log(`[HTTP] ${method} ${originalUrl} ${color}${statusCode}${reset} - ${duration}ms (IP: ${ip})`);
  });

  next();
};

module.exports = requestLogger;
