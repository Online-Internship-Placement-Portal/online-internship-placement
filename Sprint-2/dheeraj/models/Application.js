/**
 * Application Schema & Model (Sprint-2)
 * Author: Patnaikuni Sai Dheeraj (PES2UG24CS341)
 * Role: Database Setup
 * Traceability: IPR-F-008, IPR-F-009 (Duplicate Prevention), IPR-F-010, IPR-F-017, TC-Int-03, TC-Int-04, TC-Rec-02
 */

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
      default: 'Submitted',
      required: true
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    resume: {
      type: String,
      default: ''
    },
    coverNote: {
      type: String,
      maxlength: 1000,
      default: ''
    },
    recruiterFeedback: {
      type: String,
      default: ''
    },
    interviewDetails: {
      scheduledDate: Date,
      meetingLink: String,
      round: String
    }
  },
  {
    timestamps: true
  }
);

// CRITICAL: Compound Unique Index enforcing duplicate prevention per IPR-F-009 & TC-Int-04
applicationSchema.index({ student: 1, internship: 1 }, { unique: true });
applicationSchema.index({ internship: 1, status: 1 });

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);
