/**
 * Internship Controller (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-006, IPR-F-007, IPR-F-016, TC-Int-01, TC-Int-02, TC-Rec-01
 */

let inMemoryInternships = [
  {
    id: 'int_001',
    _id: 'int_001',
    title: 'Software Development Engineer Intern (Summer 2027)',
    company: 'Google',
    description: 'Work on distributed web systems, high performance backend architectures, and core algorithms.',
    location: 'Bengaluru, India',
    type: 'Full-time',
    stipend: '₹1,20,000 / month',
    requirements: ['Data Structures & Algorithms', 'C++/Java/Go', 'System Design'],
    eligibilityCriteria: { minCgpa: 7.5, allowedDepartments: ['Computer Science and Engineering'] },
    openings: 8,
    deadline: '2027-02-15T00:00:00.000Z',
    status: 'Open',
    postedBy: 'usr_recruiter_01'
  },
  {
    id: 'int_002',
    _id: 'int_002',
    title: 'Full Stack Cloud Platform Intern',
    company: 'Microsoft',
    description: 'Design interactive interfaces using React and scale backend microservices with Node.js.',
    location: 'Hyderabad, India',
    type: 'Full-time',
    stipend: '₹95,000 / month',
    requirements: ['React.js / TypeScript', 'Node.js / Express', 'REST APIs'],
    eligibilityCriteria: { minCgpa: 7.0, allowedDepartments: ['Computer Science and Engineering', 'Electronics and Communication'] },
    openings: 5,
    deadline: '2027-02-28T00:00:00.000Z',
    status: 'Open',
    postedBy: 'usr_recruiter_02'
  },
  {
    id: 'int_003',
    _id: 'int_003',
    title: 'Cloud Solutions & DevOps Intern',
    company: 'Amazon AWS',
    description: 'Automate CI/CD pipelines, containerize backend deployments, and monitor cloud health.',
    location: 'Bengaluru, India',
    type: 'Remote',
    stipend: '₹85,000 / month',
    requirements: ['Linux', 'Docker', 'Kubernetes', 'AWS Core Services'],
    eligibilityCriteria: { minCgpa: 7.0, allowedDepartments: ['Computer Science and Engineering'] },
    openings: 4,
    deadline: '2027-03-15T00:00:00.000Z',
    status: 'Open',
    postedBy: 'usr_recruiter_01'
  },
  {
    id: 'int_004',
    _id: 'int_004',
    title: 'Machine Learning & Data Intelligence Intern',
    company: 'Adobe',
    description: 'Work on computer vision and generative algorithms. Train deep learning models with PyTorch.',
    location: 'Noida, India',
    type: 'Hybrid',
    stipend: '₹1,00,000 / month',
    requirements: ['Python', 'PyTorch / TensorFlow', 'Computer Vision Basics'],
    eligibilityCriteria: { minCgpa: 8.0, allowedDepartments: ['Computer Science and Engineering'] },
    openings: 3,
    deadline: '2027-03-30T00:00:00.000Z',
    status: 'Open',
    postedBy: 'usr_recruiter_01'
  }
];

const getInternshipModel = () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        return mongoose.model('Internship');
      } catch (e) {
        return require('../../../dheeraj/models/Internship');
      }
    }
  } catch (e) {}
  return null;
};

/**
 * GET /api/internships
 * View available internships with search and filter (IPR-F-006, IPR-F-007, TC-Int-01, TC-Int-02)
 */
const getInternships = async (req, res, next) => {
  try {
    const { search, type, location, company, minStipend } = req.query;
    const InternshipModel = getInternshipModel();

    if (InternshipModel) {
      const query = { status: 'Open' };
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      if (type) query.type = type;
      if (location) query.location = { $regex: location, $options: 'i' };
      if (company) query.company = { $regex: company, $options: 'i' };

      const internships = await InternshipModel.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: internships.length,
        data: internships
      });
    }

    // In-memory fallback
    let results = inMemoryInternships.filter(i => i.status === 'Open');

    if (search) {
      const term = search.toLowerCase();
      results = results.filter(i =>
        i.title.toLowerCase().includes(term) ||
        i.company.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term)
      );
    }
    if (type) results = results.filter(i => i.type.toLowerCase() === type.toLowerCase());
    if (location) results = results.filter(i => i.location.toLowerCase().includes(location.toLowerCase()));
    if (company) results = results.filter(i => i.company.toLowerCase().includes(company.toLowerCase()));

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/internships/:id
 * Retrieve specific internship details
 */
const getInternshipById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const InternshipModel = getInternshipModel();

    if (InternshipModel) {
      const internship = await InternshipModel.findById(id).populate('postedBy', 'name email company');
      if (!internship) {
        return res.status(404).json({ success: false, message: 'Internship opportunity not found.' });
      }
      return res.status(200).json({ success: true, data: internship });
    }

    const internship = inMemoryInternships.find(i => i.id === id || i._id === id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship opportunity not found.' });
    }

    res.status(200).json({ success: true, data: internship });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/internships
 * Recruiter creates an internship listing (IPR-F-016, TC-Rec-01)
 */
const createInternship = async (req, res, next) => {
  try {
    const { title, company, description, location, type, stipend, requirements, deadline, openings } = req.body;
    const recruiterId = req.user?.id || req.user?._id || 'usr_recruiter_01';

    if (!title || !company || !description || !location || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, company, description, location, and deadline are required fields.'
      });
    }

    const InternshipModel = getInternshipModel();
    if (InternshipModel) {
      const newInternship = await InternshipModel.create({
        title,
        company,
        description,
        location,
        type: type || 'Full-time',
        stipend: stipend || 'Competitive',
        requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(r => r.trim()) : []),
        openings: openings || 1,
        deadline: new Date(deadline),
        status: 'Open',
        postedBy: recruiterId
      });

      return res.status(201).json({
        success: true,
        message: 'Internship listing created successfully.',
        data: newInternship
      });
    }

    const newInternship = {
      id: `int_${Date.now()}`,
      _id: `int_${Date.now()}`,
      title,
      company,
      description,
      location,
      type: type || 'Full-time',
      stipend: stipend || 'Competitive',
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(r => r.trim()) : []),
      openings: openings || 1,
      deadline,
      status: 'Open',
      postedBy: recruiterId,
      createdAt: new Date().toISOString()
    };

    inMemoryInternships.unshift(newInternship);
    res.status(201).json({
      success: true,
      message: 'Internship listing created successfully (in-memory).',
      data: newInternship
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/internships/:id
 * Recruiter updates an internship listing (IPR-F-016)
 */
const updateInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const InternshipModel = getInternshipModel();

    if (InternshipModel) {
      const updated = await InternshipModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Internship not found.' });
      return res.status(200).json({ success: true, message: 'Internship updated.', data: updated });
    }

    const idx = inMemoryInternships.findIndex(i => i.id === id || i._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Internship not found.' });

    inMemoryInternships[idx] = { ...inMemoryInternships[idx], ...updates };
    res.status(200).json({ success: true, message: 'Internship updated.', data: inMemoryInternships[idx] });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/internships/:id
 * Recruiter or Admin closes/deletes an internship
 */
const deleteInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const InternshipModel = getInternshipModel();

    if (InternshipModel) {
      await InternshipModel.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Internship deleted successfully.' });
    }

    inMemoryInternships = inMemoryInternships.filter(i => i.id !== id && i._id !== id);
    res.status(200).json({ success: true, message: 'Internship deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  inMemoryInternships
};
