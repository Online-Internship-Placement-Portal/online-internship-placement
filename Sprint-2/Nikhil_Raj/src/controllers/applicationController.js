/**
 * Application Management Controller (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-008, IPR-F-009 (Duplicate Prevention), IPR-F-010, IPR-F-017, TC-Int-03, TC-Int-04, TC-Rec-02
 */

let inMemoryApplications = [
  {
    id: 'app_001',
    _id: 'app_001',
    student: 'usr_student_01',
    studentEmail: 'sohel@pes.edu',
    studentName: 'Sohel Mahibubasa Chapparband',
    internship: 'int_001',
    internshipTitle: 'Software Development Engineer Intern (Summer 2027)',
    company: 'Google',
    status: 'Interview Scheduled',
    appliedDate: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    resume: 'https://storage.portal.pes.edu/resumes/PES2UG25CS826_Resume.pdf',
    coverNote: 'Pre-final year CSE student experienced in distributed systems.',
    recruiterFeedback: 'Strong algorithmic skills and solid academic record. Shortlisted for Round 1 technical interview.',
    interviewDetails: {
      scheduledDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
      meetingLink: 'https://meet.google.com/pes-sde-round1',
      round: 'Round 1: Data Structures & System Coding'
    }
  }
];

const getApplicationModels = () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      let Application, Internship, StudentProfile;
      try {
        Application = mongoose.model('Application');
      } catch (e) {
        Application = require('../../../dheeraj/models/Application');
      }
      try {
        Internship = mongoose.model('Internship');
      } catch (e) {
        Internship = require('../../../dheeraj/models/Internship');
      }
      try {
        StudentProfile = mongoose.model('StudentProfile');
      } catch (e) {
        StudentProfile = require('../../../dheeraj/models/StudentProfile');
      }
      return { Application, Internship, StudentProfile };
    }
  } catch (e) {}
  return null;
};

/**
 * POST /api/internships/:id/applications
 * Apply for an internship with duplicate application rejection (IPR-F-008, IPR-F-009, TC-Int-03, TC-Int-04)
 */
const applyForInternship = async (req, res, next) => {
  try {
    const internshipId = req.params.id;
    const studentId = req.user?.id || req.user?._id || 'usr_student_01';
    const studentEmail = req.user?.email || 'sohel@pes.edu';
    const studentName = req.user?.name || 'Sohel Mahibubasa Chapparband';
    const { coverNote, resume } = req.body;

    const models = getApplicationModels();
    if (models && models.Application) {
      // 1. Check if application already exists -> 409 Conflict
      const existing = await models.Application.findOne({
        student: studentId,
        internship: internshipId
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          statusCode: 409,
          message: 'Conflict: Duplicate application detected. You have already submitted an application for this internship.'
        });
      }

      // 2. Create new application
      const newApp = await models.Application.create({
        student: studentId,
        internship: internshipId,
        coverNote: coverNote || '',
        resume: resume || 'https://storage.portal.pes.edu/resumes/default_resume.pdf',
        status: 'Submitted'
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Internship application submitted successfully.',
        data: newApp
      });
    }

    // In-memory fallback
    const alreadyApplied = inMemoryApplications.some(
      a => (a.student === studentId || a.studentEmail === studentEmail) &&
           (a.internship === internshipId || a.internship === String(internshipId))
    );

    if (alreadyApplied) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: 'Conflict: Duplicate application detected. You have already submitted an application for this internship.'
      });
    }

    const { inMemoryInternships } = require('./internshipController');
    const targetInternship = inMemoryInternships.find(i => i.id === internshipId || i._id === internshipId);

    const newApp = {
      id: `app_${Date.now()}`,
      _id: `app_${Date.now()}`,
      student: studentId,
      studentEmail,
      studentName,
      internship: internshipId,
      internshipTitle: targetInternship ? targetInternship.title : 'Software Engineer Intern',
      company: targetInternship ? targetInternship.company : 'Tech Partner',
      status: 'Submitted',
      appliedDate: new Date().toISOString(),
      resume: resume || 'https://storage.portal.pes.edu/resumes/default_resume.pdf',
      coverNote: coverNote || 'Excited to apply for this position.'
    };

    inMemoryApplications.unshift(newApp);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Internship application submitted successfully (in-memory).',
      data: newApp
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/applications/me
 * Student views application tracking status (IPR-F-010, TC-Int-05)
 */
const getMyApplications = async (req, res, next) => {
  try {
    const studentId = req.user?.id || req.user?._id || 'usr_student_01';
    const studentEmail = req.user?.email || 'sohel@pes.edu';
    const models = getApplicationModels();

    if (models && models.Application) {
      const apps = await models.Application.find({ student: studentId })
        .populate('internship')
        .sort({ appliedDate: -1 });

      return res.status(200).json({
        success: true,
        count: apps.length,
        data: apps
      });
    }

    const userApps = inMemoryApplications.filter(
      a => a.student === studentId || a.studentEmail === studentEmail
    );

    res.status(200).json({
      success: true,
      count: userApps.length,
      data: userApps
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/applications/recruiter
 * Recruiter views applications for posted internships (IPR-F-017, TC-Rec-02)
 */
const getRecruiterApplications = async (req, res, next) => {
  try {
    const { status, internshipId } = req.query;
    const models = getApplicationModels();

    if (models && models.Application) {
      const query = {};
      if (status) query.status = status;
      if (internshipId) query.internship = internshipId;

      const apps = await models.Application.find(query)
        .populate('student', 'name email department phone')
        .populate('internship', 'title company location stipend')
        .sort({ appliedDate: -1 });

      return res.status(200).json({
        success: true,
        count: apps.length,
        data: apps
      });
    }

    let results = [...inMemoryApplications];
    if (status) results = results.filter(a => a.status.toLowerCase() === status.toLowerCase());
    if (internshipId) results = results.filter(a => a.internship === internshipId);

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
 * PUT /api/applications/:id/status
 * Recruiter updates applicant status with feedback note (IPR-F-017, TC-Rec-02)
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, recruiterFeedback, interviewDate, meetingLink, round } = req.body;

    const validStatuses = ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const models = getApplicationModels();
    if (models && models.Application) {
      const updateData = {
        status,
        recruiterFeedback: recruiterFeedback || undefined
      };
      if (interviewDate || meetingLink) {
        updateData.interviewDetails = {
          scheduledDate: interviewDate ? new Date(interviewDate) : undefined,
          meetingLink,
          round: round || 'Technical Interview'
        };
      }

      const updated = await models.Application.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).populate('internship').populate('student');

      if (!updated) return res.status(404).json({ success: false, message: 'Application not found.' });

      return res.status(200).json({
        success: true,
        message: `Candidate application status updated to ${status}.`,
        data: updated
      });
    }

    const appIndex = inMemoryApplications.findIndex(a => a.id === id || a._id === id);
    if (appIndex === -1) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    inMemoryApplications[appIndex].status = status;
    if (recruiterFeedback) inMemoryApplications[appIndex].recruiterFeedback = recruiterFeedback;
    if (interviewDate || meetingLink) {
      inMemoryApplications[appIndex].interviewDetails = {
        scheduledDate: interviewDate,
        meetingLink,
        round: round || 'Technical Interview'
      };
    }

    res.status(200).json({
      success: true,
      message: `Candidate application status updated to ${status} (in-memory).`,
      data: inMemoryApplications[appIndex]
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyForInternship,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
  inMemoryApplications
};
