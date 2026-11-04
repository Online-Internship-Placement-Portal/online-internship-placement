/**
 * Student Profile Controller (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-004, IPR-F-005, TC-Prof-01, TC-Prof-02
 */

let inMemoryProfiles = new Map();

// Initialize default student profile
inMemoryProfiles.set('sohel@pes.edu', {
  studentId: 'usr_student_01',
  usn: 'PES2UG25CS826',
  cgpa: 8.92,
  semester: 5,
  department: 'Computer Science and Engineering',
  skills: ['JavaScript', 'Node.js', 'React.js', 'Express.js', 'MongoDB', 'Data Structures', 'Git'],
  resumeUrl: 'https://storage.portal.pes.edu/resumes/PES2UG25CS826_Resume.pdf',
  githubUrl: 'https://github.com/sohel832',
  linkedinUrl: 'https://linkedin.com/in/sohel-chapparband',
  portfolioUrl: 'https://sohel.dev',
  bio: 'Pre-final year CSE student passionate about scalable backend architectures and distributed systems.',
  placementStatus: 'Eligible',
  certifications: [
    { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: '2025-11-10' }
  ],
  projects: [
    { title: 'Online Placement Portal', techStack: ['React', 'Node', 'MongoDB'], description: 'Full stack portal for university placements.' }
  ]
});

const getProfileModel = () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        return mongoose.model('StudentProfile');
      } catch (e) {
        return require('../../../dheeraj/models/StudentProfile');
      }
    }
  } catch (e) {}
  return null;
};

/**
 * GET /api/profile/me
 * Retrieve current authenticated student profile (IPR-F-004)
 */
const getMyProfile = async (req, res, next) => {
  try {
    const email = req.user?.email || 'sohel@pes.edu';
    const userId = req.user?.id || req.user?._id;
    const ProfileModel = getProfileModel();

    if (ProfileModel && userId) {
      let profile = await ProfileModel.findOne({ student: userId }).populate('student', 'name email role department phone');
      if (!profile) {
        // Create an initial empty profile if none exists
        profile = await ProfileModel.create({
          student: userId,
          department: req.user?.department || 'Computer Science and Engineering'
        });
      }
      return res.status(200).json({ success: true, data: profile });
    }

    // In-memory fallback
    const profile = inMemoryProfiles.get(email) || {
      studentId: userId || 'usr_student_01',
      usn: 'PES2UG25CS826',
      cgpa: 8.5,
      semester: 5,
      department: 'Computer Science and Engineering',
      skills: ['JavaScript', 'React', 'Node.js'],
      resumeUrl: '',
      bio: '',
      placementStatus: 'Eligible'
    };

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/profile/me
 * Update student profile and academic details (IPR-F-004, IPR-F-005, TC-Prof-01, TC-Prof-02)
 */
const updateMyProfile = async (req, res, next) => {
  try {
    const email = req.user?.email || 'sohel@pes.edu';
    const userId = req.user?.id || req.user?._id;
    const { usn, cgpa, semester, department, skills, resumeUrl, githubUrl, linkedinUrl, portfolioUrl, bio } = req.body;

    // Validation
    if (cgpa !== undefined && (cgpa < 0 || cgpa > 10)) {
      return res.status(400).json({ success: false, message: 'CGPA must be between 0.0 and 10.0' });
    }
    if (semester !== undefined && (semester < 1 || semester > 8)) {
      return res.status(400).json({ success: false, message: 'Semester must be between 1 and 8' });
    }

    const ProfileModel = getProfileModel();
    if (ProfileModel && userId) {
      const updated = await ProfileModel.findOneAndUpdate(
        { student: userId },
        {
          $set: {
            usn: usn ? usn.toUpperCase().trim() : undefined,
            cgpa,
            semester,
            department,
            skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : undefined),
            resumeUrl,
            githubUrl,
            linkedinUrl,
            portfolioUrl,
            bio
          }
        },
        { new: true, upsert: true }
      );
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: updated
      });
    }

    // In-memory fallback
    const existing = inMemoryProfiles.get(email) || {};
    const updatedProfile = {
      ...existing,
      usn: usn ? usn.toUpperCase().trim() : existing.usn,
      cgpa: cgpa !== undefined ? Number(cgpa) : existing.cgpa,
      semester: semester !== undefined ? Number(semester) : existing.semester,
      department: department || existing.department,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : existing.skills),
      resumeUrl: resumeUrl !== undefined ? resumeUrl : existing.resumeUrl,
      githubUrl: githubUrl !== undefined ? githubUrl : existing.githubUrl,
      linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : existing.linkedinUrl,
      portfolioUrl: portfolioUrl !== undefined ? portfolioUrl : existing.portfolioUrl,
      bio: bio !== undefined ? bio : existing.bio
    };

    inMemoryProfiles.set(email, updatedProfile);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully (in-memory).',
      data: updatedProfile
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  inMemoryProfiles
};
