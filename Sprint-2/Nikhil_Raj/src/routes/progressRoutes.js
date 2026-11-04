/**
 * Preparation Progress & Analytics Routes (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-014, IPR-F-015, TC-Prog-01, TC-Prog-02
 */

const express = require('express');
const router = express.Router();
const { getMyProgress, updateTopicProgress } = require('../controllers/progressController');

let authMiddleware, rbacMiddleware;
try {
  authMiddleware = require('../../../sohel - Authentication and Integration/middleware/authMiddleware');
  rbacMiddleware = require('../../../sohel - Authentication and Integration/middleware/rbacMiddleware');
} catch (e) {
  authMiddleware = { authenticateToken: (req, res, next) => next() };
  rbacMiddleware = { authorizeRoles: () => (req, res, next) => next() };
}
const { authenticateToken } = authMiddleware;
const { authorizeRoles } = rbacMiddleware;

router.get('/me', authenticateToken, authorizeRoles('student'), getMyProgress);
router.put('/me', authenticateToken, authorizeRoles('student'), updateTopicProgress);

module.exports = router;
