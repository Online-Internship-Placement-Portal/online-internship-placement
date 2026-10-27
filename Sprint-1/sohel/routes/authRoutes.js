/**
 * Authentication Routes
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Requirement Traceability: IPR-F-001, IPR-F-002, IPR-SR-001, SAD Section 4.3 API Design
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { sanitizeInput } = require('../middleware/sanitizeMiddleware');

// POST /api/auth/register - Register new user (Student / Recruiter / Admin)
router.post('/register', sanitizeInput, authController.register);

// POST /api/auth/login - Authenticate user & return JWT
router.post('/login', sanitizeInput, authController.login);

// GET /api/auth/me - Get current authenticated user profile
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
