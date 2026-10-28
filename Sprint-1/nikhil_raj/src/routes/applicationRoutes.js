/**
 * Application Management Routes
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-010, IPR-F-017, TC-Rec-02, SAD Section 4.3
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
const { inMemoryApplications, inMemoryInternships } = require('./internshipRoutes');

// Helper for Mongoose models
const getApplicationModel = () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return mongoose.model('Application');
    }
  } catch (e) {}
  return null;
};

/**
 * GET /api/applications/me
 * Student views their application status (IPR-F-010)
 */
router.get('/me', authenticateToken, authorizeRoles('student'), async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const Application = getApplicationModel();

    if (Application) {
      const applications = await Application.find({ student: studentId })
        .populate('internship')
        .sort({ appliedDate: -1 });
      return res.status(200).json({ success: true, count: applications.length, data: applications });
    }

    // In-memory fallback
    const studentApps = inMemoryApplications
      .filter(a => a.student === studentId)
      .map(app => {
        const internship = inMemoryInternships.find(i => (i.id === app.internship || i._id === app.internship));
        return { ...app, internship };
      });

    res.status(200).json({ success: true, count: studentApps.length, data: studentApps });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/applications
 * Recruiter & Admin view candidate applications (IPR-F-017)
 */
router.get('/', authenticateToken, authorizeRoles('recruiter', 'admin'), async (req, res, next) => {
  try {
    const Application = getApplicationModel();
    if (Application) {
      const applications = await Application.find()
        .populate('student', 'name email department phone')
        .populate('internship')
        .sort({ appliedDate: -1 });
      return res.status(200).json({ success: true, count: applications.length, data: applications });
    }

    // In-memory fallback
    const populated = inMemoryApplications.map(app => {
      const internship = inMemoryInternships.find(i => (i.id === app.internship || i._id === app.internship));
      return {
        ...app,
        student: { id: app.student, name: 'Student Candidate', email: 'candidate@pes.edu' },
        internship
      };
    });

    res.status(200).json({ success: true, count: populated.length, data: populated });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/applications/:id/status
 * Recruiter updates status to 'Shortlisted' or 'Rejected' (IPR-F-017, TC-Rec-02)
 */
router.put('/:id/status', authenticateToken, authorizeRoles('recruiter', 'admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Submitted', 'Shortlisted', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const Application = getApplicationModel();
    if (Application) {
      const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!app) {
        return res.status(404).json({ success: false, message: 'Application not found.' });
      }
      return res.status(200).json({ success: true, message: `Application status updated to ${status}.`, data: app });
    }

    const app = inMemoryApplications.find(a => (a.id === req.params.id || a._id === req.params.id));
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }
    app.status = status;
    res.status(200).json({ success: true, message: `Application status updated to ${status}.`, data: app });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
