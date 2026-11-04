/**
 * Student Profile Routes (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-004, IPR-F-005, TC-Prof-01, TC-Prof-02
 */

const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile } = require('../controllers/profileController');

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

router.get('/me', authenticateToken, authorizeRoles('student'), getMyProfile);
router.put('/me', authenticateToken, authorizeRoles('student'), updateMyProfile);

module.exports = router;
