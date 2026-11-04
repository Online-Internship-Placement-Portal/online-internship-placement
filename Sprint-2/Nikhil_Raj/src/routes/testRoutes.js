/**
 * Aptitude Test Evaluation & History Routes (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-011, IPR-F-012, IPR-F-013, TC-Test-01, TC-Test-02, TC-Test-03
 */

const express = require('express');
const router = express.Router();
const {
  getAptitudeTests,
  getAptitudeTestById,
  submitAptitudeTest,
  getTestHistory
} = require('../controllers/testController');

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

// View active tests (IPR-F-011)
router.get('/', authenticateToken, getAptitudeTests);

// View historical test attempts and scores (IPR-F-013, TC-Test-03)
router.get('/history/me', authenticateToken, authorizeRoles('student'), getTestHistory);

// Attempt test (IPR-F-011)
router.get('/:id', authenticateToken, getAptitudeTestById);

// Submit test for auto-scoring (IPR-F-012, TC-Test-02)
router.post('/:id/submit', authenticateToken, authorizeRoles('student'), submitAptitudeTest);

module.exports = router;
