/**
 * Authentication Routes (Sprint-2)
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Traceability: IPR-F-001, IPR-F-002, IPR-SR-001, TC-Auth-01, TC-Auth-02
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { sanitizeInput } = require('../middleware/sanitizeMiddleware');

// Public endpoints with sanitization
router.post('/register', sanitizeInput, register);
router.post('/login', sanitizeInput, login);

// Protected endpoint
router.get('/me', authenticateToken, getMe);

module.exports = router;
