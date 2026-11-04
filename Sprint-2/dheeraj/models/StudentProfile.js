/**
 * StudentProfile Schema & Model (Sprint-2)
 * Author: Patnaikuni Sai Dheeraj (PES2UG24CS341)
 * Role: Database Setup
 * Traceability: IPR-F-004, IPR-F-005, TC-Prof-01, TC-Prof-02
 */

const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    usn: {
      type: String,
      trim: true,
      uppercase: true,
      default: ''
    },
    cgpa: {
      type: Number,
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10.0'],
      default: 0.0
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
      default: 5
    },
    department: {
      type: String,
      default: 'Computer Science and Engineering'
    },
    skills: {
      type: [String],
      default: []
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    githubUrl: {
      type: String,
      default: ''
    },
    linkedinUrl: {
      type: String,
      default: ''
    },
    portfolioUrl: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: ''
    },
    placementStatus: {
      type: String,
      enum: ['Eligible', 'Applied', 'Shortlisted', 'Placed', 'Opted Out'],
      default: 'Eligible'
    },
    certifications: [
      {
        title: String,
        issuer: String,
        issueDate: Date,
        credentialUrl: String
      }
    ],
    projects: [
      {
        title: String,
        description: String,
        techStack: [String],
        githubLink: String
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);
