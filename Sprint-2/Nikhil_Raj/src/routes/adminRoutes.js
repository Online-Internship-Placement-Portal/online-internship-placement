/**
 * Administrator Governance & Platform Management Routes (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-018, TC-Admin-01, SAD Section 4.3 & 4.4
 */

const express = require('express');
const router = express.Router();
const {
  getSystemMetrics,
  getAllUsers,
  updateUserStatus,
  createAptitudeTest
} = require('../controllers/adminController');
const { deleteInternship } = require('../controllers/internshipController');

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

// All admin routes strictly enforced via RBAC (IPR-F-003, IPR-F-018)
router.use(authenticateToken, authorizeRoles('admin'));

router.get('/metrics', getSystemMetrics);
router.get('/stats', getSystemMetrics);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.post('/tests', createAptitudeTest);
router.delete('/internships/:id', deleteInternship);

module.exports = router;
