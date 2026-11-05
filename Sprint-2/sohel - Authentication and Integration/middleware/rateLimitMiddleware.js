/**
 * Sliding Window Rate Limiting Middleware (Sprint-2 Security)
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Traceability: IPR-SR-002 (Brute-Force Protection), IPR-NF-001 (SLA)
 */

class SlidingWindowRateLimiter {
  constructor(windowMs = 15 * 60 * 1000, maxRequests = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.records = new Map();
  }

  middleware() {
    return (req, res, next) => {
      const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
      const now = Date.now();
      const windowStart = now - this.windowMs;

      if (!this.records.has(clientIp)) {
        this.records.set(clientIp, []);
      }

      const timestamps = this.records.get(clientIp);
      // Filter out timestamps outside current sliding window
      const validTimestamps = timestamps.filter(t => t > windowStart);
      this.records.set(clientIp, validTimestamps);

      if (validTimestamps.length >= this.maxRequests) {
        const retryAfterSeconds = Math.ceil((validTimestamps[0] + this.windowMs - now) / 1000);
        res.setHeader('Retry-After', retryAfterSeconds);
        res.setHeader('X-RateLimit-Limit', this.maxRequests);
        res.setHeader('X-RateLimit-Remaining', 0);
        return res.status(429).json({
          success: false,
          statusCode: 429,
          error: 'Too Many Requests',
          message: `Too many requests from this client. Please retry after ${retryAfterSeconds} seconds.`
        });
      }

      validTimestamps.push(now);
      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', this.maxRequests - validTimestamps.length);
      next();
    };
  }

  reset() {
    this.records.clear();
  }
}

// Strict limiter for authentication endpoints (prevent brute-force password guessing)
const authLimiter = new SlidingWindowRateLimiter(15 * 60 * 1000, 15);

// General limiter for public API endpoints
const apiLimiter = new SlidingWindowRateLimiter(60 * 1000, 120);

module.exports = {
  SlidingWindowRateLimiter,
  authLimiter,
  apiLimiter
};
