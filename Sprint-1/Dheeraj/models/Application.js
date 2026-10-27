/**
 * Application Schema & Model
 * Author: Patnaikuni Sai Dheeraj (PES2UG24CS341)
 * Role: Database Setup
 * Traceability: IPR-F-008, IPR-F-009 (Duplicate Prevention), IPR-F-010, IPR-F-017, TC-Int-03, TC-Int-04
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
      enum: ['Submitted', 'Shortlisted', 'Rejected'],
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
    }
  },
  {
    timestamps: true
  }
);

// CRITICAL: Compound Unique Index to prevent duplicate applications per IPR-F-009 & TC-Int-04
applicationSchema.index({ student: 1, internship: 1 }, { unique: true });

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);
