/**
 * TestResult Schema & Model
 * Author: Patnaikuni Sai Dheeraj (PES2UG24CS341)
 * Role: Database Setup
 * Traceability: IPR-F-012, IPR-F-013, TC-Test-02, TC-Test-03
 */

const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AptitudeTest',
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    totalMarks: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOption: String,
        isCorrect: Boolean
      }
    ],
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.TestResult || mongoose.model('TestResult', testResultSchema);
