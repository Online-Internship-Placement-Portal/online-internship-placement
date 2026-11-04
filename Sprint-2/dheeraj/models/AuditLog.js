/**
 * AuditLog Schema & Model (Sprint-2)
 * Author: Patnaikuni Sai Dheeraj (PES2UG24CS341)
 * Role: Database Setup
 * Traceability: IPR-F-018, TC-Admin-01, SAD Section 4.4
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    targetEntity: {
      type: String,
      enum: ['User', 'Internship', 'Application', 'AptitudeTest', 'System']
    },
    targetId: String,
    details: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

auditLogSchema.index({ timestamp: -1 });

module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
