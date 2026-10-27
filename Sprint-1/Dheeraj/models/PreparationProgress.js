/**
 * PreparationProgress Schema & Model
 * Author: Patnaikuni Sai Dheeraj (PES2UG24CS341)
 * Role: Database Setup
 * Traceability: IPR-F-014, IPR-F-015, TC-Prog-01, TC-Prog-02
 */

const mongoose = require('mongoose');

const preparationProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Data Structures', 'Algorithms', 'Aptitude', 'Core CS Concepts', 'System Design'],
      default: 'Data Structures'
    },
    completed: {
      type: Boolean,
      default: false
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

preparationProgressSchema.index({ student: 1, topic: 1 }, { unique: true });

module.exports = mongoose.models.PreparationProgress || mongoose.model('PreparationProgress', preparationProgressSchema);
