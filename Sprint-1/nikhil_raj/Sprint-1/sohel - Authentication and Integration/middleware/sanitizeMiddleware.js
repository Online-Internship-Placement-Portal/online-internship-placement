/**
 * Input Sanitization & Security Middleware
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Requirement Traceability: IPR-NF-005, IPR-SR-005, TC-Sec-05
 */

/**
 * Strips HTML tags, script patterns, and potentially malicious payloads from input strings
 * Prevents Cross-Site Scripting (XSS) and payload injection attacks.
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  // Remove script tags and contents, HTML tags, and dangerous javascript: protocol prefixes
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onload\s*=/gi, '')
    .trim();
};

/**
 * Recursively sanitizes objects and nested structures
 */
const sanitizePayload = (data) => {
  if (!data) return data;
  if (typeof data === 'string') return sanitizeString(data);
  if (Array.isArray(data)) return data.map(item => sanitizePayload(item));
  if (typeof data === 'object') {
    const cleanObj = {};
    for (const key of Object.keys(data)) {
      cleanObj[key] = sanitizePayload(data[key]);
    }
    return cleanObj;
  }
  return data;
};

/**
 * Middleware that cleans request body, query parameters, and URL parameters
 */
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizePayload(req.body);
  }
  if (req.query) {
    req.query = sanitizePayload(req.query);
  }
  if (req.params) {
    req.params = sanitizePayload(req.params);
  }
  next();
};

module.exports = {
  sanitizeString,
  sanitizePayload,
  sanitizeInput
};
