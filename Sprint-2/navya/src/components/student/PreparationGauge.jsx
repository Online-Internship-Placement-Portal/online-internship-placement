/**
 * Placement Readiness Progress Gauge Component
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-015, TC-Prog-02
 */

import React from 'react';

export default function PreparationGauge({ overallPercentage = 0, categoryBreakdown = [] }) {
  return (
    <div className="card">
      <div className="card-title">
        <span>Placement Readiness Analytics</span>
        <span className="badge badge-shortlisted">{overallPercentage}% Ready</span>
      </div>

      <div className="progress-container" aria-label={`Overall readiness ${overallPercentage}%`}>
        <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, overallPercentage))}%` }} />
      </div>

      <div className="grid-3" style={{ marginTop: '1rem' }}>
        {categoryBreakdown.map((item) => (
          <div key={item.category} className="metric-subcard">
            <div className="metric-header">
              <span className="metric-name">{item.category}</span>
              <strong>{item.percentage}%</strong>
            </div>
            <div className="progress-container" style={{ height: '8px' }}>
              <div className="progress-fill" style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
