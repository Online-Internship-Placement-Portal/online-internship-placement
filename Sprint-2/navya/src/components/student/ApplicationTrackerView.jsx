/**
 * Multi-Stage Application Status Pipeline Component
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-010, TC-Int-05
 */

import React, { useState, useEffect } from 'react';
import { getMyApplications } from '../../services/internshipService';
import StatusBadge from '../common/StatusBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertBanner from '../common/AlertBanner';

const STAGES = ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'];

export default function ApplicationTrackerView() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.data || []))
      .catch((err) => setError(err.message || 'Unable to load applications.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading application status pipeline..." />;

  return (
    <div>
      {error && <AlertBanner alert={{ type: 'error', message: error }} onClose={() => setError('')} />}

      <div className="card">
        <div className="card-title">
          <span>My Application Pipeline</span>
          <span className="badge badge-submitted">{applications.length} Total</span>
        </div>

        {applications.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>You haven't applied to any internships yet.</p>
        ) : (
          applications.map((app) => {
            const currentStatus = app.status === 'Applied' ? 'Submitted' : (app.status || 'Submitted');
            const currentIdx = STAGES.indexOf(currentStatus);

            return (
              <div key={app._id || app.id} className="pipeline-card">
                <div className="card-title">
                  <span>{app.internship?.company || 'Tech Company'} — {app.internship?.title || 'Internship'}</span>
                  <StatusBadge label={currentStatus} />
                </div>

                {currentStatus !== 'Rejected' && (
                  <div className="pipeline-row">
                    {STAGES.map((stage, idx) => {
                      const done = idx < currentIdx;
                      const active = idx === currentIdx;
                      return (
                        <div key={stage} className="pipeline-step">
                          <span className={`step-dot ${done ? 'step-done' : active ? 'step-active' : ''}`}>
                            {done ? '✓' : idx + 1}
                          </span>
                          <span className="step-text">{stage}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {app.recruiterFeedback && (
                  <p className="feedback-note">
                    <strong>Recruiter Feedback:</strong> {app.recruiterFeedback}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
