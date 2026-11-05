/**
 * Authentication & System Health Routes (Sprint-2)
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Traceability: IPR-F-001, IPR-F-002, IPR-SR-001, IPR-NF-002, TC-Auth-01, TC-Auth-02, TC-Rel-01
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { getSystemHealth } = require('../controllers/healthController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { sanitizeInput } = require('../middleware/sanitizeMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

// Public endpoints with sliding-window brute-force protection & sanitization
router.post('/register', authLimiter.middleware(), sanitizeInput, register);
router.post('/login', authLimiter.middleware(), sanitizeInput, login);

// Protected endpoint
router.get('/me', authenticateToken, getMe);

// System telemetry and health check
router.get('/health', getSystemHealth);

module.exports = router;
