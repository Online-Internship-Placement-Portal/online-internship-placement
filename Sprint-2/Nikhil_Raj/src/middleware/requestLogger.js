/**
 * HTTP Request Logger & Latency Monitor (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-NF-001 (Response Time <= 3s), TC-Perf-01, SAD Section 4.4
 */

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLine = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (duration > 3000) {
      console.warn(`[PERF ALERT] Latency exceeded 3000ms SLA: ${logLine}`);
    } else {
      console.log(logLine);
    }
  });

  next();
};

module.exports = requestLogger;
