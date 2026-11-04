/**
 * Internship Schema & Model (Sprint-2)
 * Author: Patnaikuni Sai Dheeraj (PES2UG24CS341)
 * Role: Database Setup
 * Traceability: IPR-F-006, IPR-F-007, IPR-F-016, TC-Int-01, TC-Int-02, TC-Rec-01
 */

const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Internship title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Remote', 'Hybrid'],
      default: 'Full-time'
    },
    stipend: {
      type: String,
      default: 'Competitive'
    },
    requirements: {
      type: [String],
      default: []
    },
    eligibilityCriteria: {
      minCgpa: {
        type: Number,
        default: 7.0
      },
      allowedDepartments: {
        type: [String],
        default: ['Computer Science and Engineering', 'Information Science and Engineering', 'Electronics and Communication']
      }
    },
    openings: {
      type: Number,
      default: 5
    },
    deadline: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Archived'],
      default: 'Open'
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

internshipSchema.index({ status: 1, location: 1 });
internshipSchema.index({ title: 'text', company: 'text', description: 'text' });

module.exports = mongoose.models.Internship || mongoose.model('Internship', internshipSchema);
