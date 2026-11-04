/**
 * Application Tracking & Review Routes (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-010, IPR-F-017, TC-Int-05, TC-Rec-02
 */

const express = require('express');
const router = express.Router();
const {
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');

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

// Student views their applications
router.get('/me', authenticateToken, authorizeRoles('student'), getMyApplications);

// Recruiter views candidate applications for their internships
router.get('/recruiter', authenticateToken, authorizeRoles('recruiter', 'admin'), getRecruiterApplications);

// Recruiter updates status of candidate application
router.put('/:id/status', authenticateToken, authorizeRoles('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
