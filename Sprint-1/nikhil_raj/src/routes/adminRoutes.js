/**
 * Administrator Governance & Analytics Routes
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-018, TC-Admin-01, SAD Section 4.3
 */

const express = require('express');
const router = express.Router();
let authMiddleware, rbacMiddleware;
try {
  authMiddleware = require('../../../sohel - Authentication and Integration/middleware/authMiddleware');
  rbacMiddleware = require('../../../sohel - Authentication and Integration/middleware/rbacMiddleware');
} catch (e) {
  authMiddleware = require('../../../sohel/middleware/authMiddleware');
  rbacMiddleware = require('../../../sohel/middleware/rbacMiddleware');
}
const { authenticateToken } = authMiddleware;
const { authorizeRoles } = rbacMiddleware;

/**
 * GET /api/admin/stats
 * View system analytics and counters (IPR-F-018)
 */
router.get('/stats', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      registeredStudents: 412,
      registeredRecruiters: 38,
      activeInternships: 45,
      totalApplications: 1280,
      aptitudeTestsConducted: 890,
      systemHealth: 'OPERATIONAL 99.9%',
      serverUptimeHours: 720
    }
  });
});

/**
 * GET /api/admin/users
 * View registered users (IPR-F-018 / TC-Admin-01)
 */
router.get('/users', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { id: 'u1', name: 'Sohel Chapparband', email: 'sohel@pes.edu', role: 'student', department: 'CSE' },
      { id: 'u2', name: 'Navya R', email: 'navya@pes.edu', role: 'student', department: 'CSE' },
      { id: 'u3', name: 'Google Recruiter', email: 'recruiter@google.com', role: 'recruiter', department: 'HR' },
      { id: 'u4', name: 'Placement Officer', email: 'admin@pes.edu', role: 'admin', department: 'Placement Cell' }
    ]
  });
});

module.exports = router;
