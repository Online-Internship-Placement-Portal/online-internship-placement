/**
 * Internship Management Routes (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-006, IPR-F-007, IPR-F-016, TC-Int-01, TC-Int-02, TC-Rec-01
 */

const express = require('express');
const router = express.Router();
const {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship
} = require('../controllers/internshipController');
const { applyForInternship } = require('../controllers/applicationController');

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

// Public or student-accessible routes
router.get('/', getInternships);
router.get('/:id', getInternshipById);

// Student applies for internship (IPR-F-008, IPR-F-009)
router.post('/:id/applications', authenticateToken, authorizeRoles('student'), applyForInternship);

// Recruiter manages internship listings (IPR-F-016, TC-Rec-01)
router.post('/', authenticateToken, authorizeRoles('recruiter', 'admin'), createInternship);
router.put('/:id', authenticateToken, authorizeRoles('recruiter', 'admin'), updateInternship);
router.delete('/:id', authenticateToken, authorizeRoles('recruiter', 'admin'), deleteInternship);

module.exports = router;
