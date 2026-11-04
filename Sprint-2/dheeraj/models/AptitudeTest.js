/**
 * AptitudeTest Schema & Model (Sprint-2)
 * Author: Patnaikuni Sai Dheeraj (PES2UG24CS341)
 * Role: Database Setup
 * Traceability: IPR-F-011, IPR-F-012, TC-Test-01, TC-Test-02
 */

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true }
  },
  correctOption: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: true
  },
  marks: {
    type: Number,
    default: 1
  },
  explanation: {
    type: String,
    default: ''
  }
});

const aptitudeTestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Technical & Data Structures', 'Core CS Concepts'],
      default: 'Quantitative Aptitude'
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 30
    },
    totalMarks: {
      type: Number,
      required: true
    },
    passingScore: {
      type: Number,
      default: 60
    },
    instructions: {
      type: String,
      default: 'Each question carries equal marks. Choose the single best answer. Submit before time expires.'
    },
    questions: [questionSchema],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.AptitudeTest || mongoose.model('AptitudeTest', aptitudeTestSchema);
