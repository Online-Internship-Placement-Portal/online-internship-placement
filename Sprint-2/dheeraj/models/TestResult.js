/**
 * TestResult Schema & Model (Sprint-2)
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
      required: true,
      min: 0
    },
    totalMarks: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    passed: {
      type: Boolean,
      required: true
    },
    answers: [
      {
        questionId: String,
        questionText: String,
        selectedOption: String,
        correctOption: String,
        isCorrect: Boolean,
        explanation: String
      }
    ],
    durationTakenSeconds: {
      type: Number,
      default: 0
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

testResultSchema.index({ student: 1, submittedAt: -1 });

module.exports = mongoose.models.TestResult || mongoose.model('TestResult', testResultSchema);
