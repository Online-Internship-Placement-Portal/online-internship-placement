/**
 * StudentProfile Schema & Model
 * Author: Patnaikuni Sai Dheeraj (PES2UG24CS341)
 * Role: Database Setup
 * Traceability: IPR-F-004, IPR-F-005, TC-Prof-01
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
      min: 0,
      max: 10,
      default: 0.0
    },
    skills: {
      type: [String],
      default: []
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
      default: 5
    },
    bio: {
      type: String,
      maxlength: 500,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);
