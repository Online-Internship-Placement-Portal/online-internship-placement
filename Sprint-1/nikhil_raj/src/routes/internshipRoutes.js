/**
 * Internship Routes & Controllers
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-006, IPR-F-007, IPR-F-008, IPR-F-009, IPR-F-016, SAD Section 4.3
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

// In-memory store fallback if MongoDB is not connected
let inMemoryInternships = [
  {
    id: 'int_001',
    _id: 'int_001',
    title: 'Software Development Engineer Intern',
    company: 'Google',
    description: 'Work on distributed web systems, high performance backend architectures, and core algorithms.',
    location: 'Bengaluru, India',
    type: 'Full-time',
    stipend: '₹1,20,000 / month',
    deadline: '2027-01-15T00:00:00.000Z',
    status: 'Open',
    postedBy: 'recruiter_001'
  },
  {
    id: 'int_002',
    _id: 'int_002',
    title: 'Full Stack Web Developer Intern',
    company: 'Microsoft',
    description: 'Design interactive interfaces using React and scale backend microservices with Node.js.',
    location: 'Hyderabad, India',
    type: 'Full-time',
    stipend: '₹95,000 / month',
    deadline: '2027-02-01T00:00:00.000Z',
    status: 'Open',
    postedBy: 'recruiter_002'
  },
  {
    id: 'int_003',
    _id: 'int_003',
    title: 'Cloud & DevOps Intern',
    company: 'Amazon AWS',
    description: 'Automate CI/CD pipelines, containerize backend deployments, and monitor cloud health.',
    location: 'Bengaluru, India',
    type: 'Remote',
    stipend: '₹85,000 / month',
    deadline: '2027-02-28T00:00:00.000Z',
    status: 'Open',
    postedBy: 'recruiter_003'
  }
];

let inMemoryApplications = [];

// Helper to get Mongoose models safely
const getMongooseModels = () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return {
        Internship: mongoose.model('Internship'),
        Application: mongoose.model('Application')
      };
    }
  } catch (e) {}
  return null;
};

/**
 * GET /api/internships
 * View available internships with optional search and filter (IPR-F-006, IPR-F-007)
 */
router.get('/', async (req, res, next) => {
  try {
    const { search, type, location } = req.query;
    const models = getMongooseModels();

    if (models) {
      const query = { status: 'Open' };
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      if (type && type !== 'All') {
        query.type = type;
      }
      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }
      const internships = await models.Internship.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: internships.length, data: internships });
    }

    // In-memory fallback
    let filtered = [...inMemoryInternships];
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(term) || 
        i.company.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term)
      );
    }
    if (type && type !== 'All') {
      filtered = filtered.filter(i => i.type.toLowerCase() === type.toLowerCase());
    }
    if (location) {
      filtered = filtered.filter(i => i.location.toLowerCase().includes(location.toLowerCase()));
    }

    res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/internships/:id
 * View specific internship details (SAD Section 4.3)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const models = getMongooseModels();
    if (models) {
      const internship = await models.Internship.findById(req.params.id);
      if (!internship) {
        return res.status(404).json({ success: false, message: 'Internship listing not found.' });
      }
      return res.status(200).json({ success: true, data: internship });
    }

    const item = inMemoryInternships.find(i => (i.id === req.params.id || i._id === req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Internship listing not found.' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/internships
 * Create a new internship posting (Recruiter only, IPR-F-016)
 */
router.post('/', authenticateToken, authorizeRoles('recruiter', 'admin'), async (req, res, next) => {
  try {
    const { title, company, description, location, type, stipend, deadline } = req.body;
    if (!title || !company || !description || !location || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, company, description, location, and deadline are required.'
      });
    }

    const models = getMongooseModels();
    if (models) {
      const newInternship = await models.Internship.create({
        title,
        company,
        description,
        location,
        type: type || 'Full-time',
        stipend: stipend || 'Competitive',
        deadline: new Date(deadline),
        postedBy: req.user.id
      });
      return res.status(201).json({ success: true, message: 'Internship created successfully.', data: newInternship });
    }

    const newId = 'int_' + Date.now();
    const item = {
      id: newId,
      _id: newId,
      title,
      company,
      description,
      location,
      type: type || 'Full-time',
      stipend: stipend || 'Competitive',
      deadline,
      status: 'Open',
      postedBy: req.user.id
    };
    inMemoryInternships.unshift(item);
    res.status(201).json({ success: true, message: 'Internship created successfully.', data: item });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/internships/:id/applications
 * Student applies for internship with DUPLICATE PREVENTION (IPR-F-008, IPR-F-009, TC-Int-03, TC-Int-04)
 */
router.post('/:id/applications', authenticateToken, authorizeRoles('student'), async (req, res, next) => {
  try {
    const internshipId = req.params.id;
    const studentId = req.user.id;
    const { resume, coverNote } = req.body;

    const models = getMongooseModels();
    if (models) {
      // 1. Check if application already exists (IPR-F-009 / TC-Int-04)
      const existingApp = await models.Application.findOne({
        student: studentId,
        internship: internshipId
      });

      if (existingApp) {
        return res.status(409).json({
          success: false,
          statusCode: 409,
          message: 'Conflict: You have already submitted an application for this internship opportunity.'
        });
      }

      const application = await models.Application.create({
        student: studentId,
        internship: internshipId,
        status: 'Submitted',
        resume: resume || '',
        coverNote: coverNote || ''
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Internship application submitted successfully.',
        data: application
      });
    }

    // In-memory duplicate check
    const duplicate = inMemoryApplications.find(
      app => app.student === studentId && app.internship === internshipId
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: 'Conflict: You have already submitted an application for this internship opportunity.'
      });
    }

    const newApp = {
      id: 'app_' + Date.now(),
      _id: 'app_' + Date.now(),
      student: studentId,
      internship: internshipId,
      status: 'Submitted',
      appliedDate: new Date(),
      resume: resume || '',
      coverNote: coverNote || ''
    };
    inMemoryApplications.push(newApp);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Internship application submitted successfully.',
      data: newApp
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  router,
  inMemoryInternships,
  inMemoryApplications
};
