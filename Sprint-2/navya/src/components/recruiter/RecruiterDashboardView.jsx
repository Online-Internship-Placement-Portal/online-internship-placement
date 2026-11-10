/**
 * Recruiter Management & Candidate Review Dashboard
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-016, IPR-F-017, TC-Rec-01, TC-Rec-02
 */

import React, { useState, useEffect } from 'react';
import { getAllApplications, updateApplicationStatus } from '../../services/internshipService';
import PostInternshipForm from './PostInternshipForm';
import StatusBadge from '../common/StatusBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertBanner from '../common/AlertBanner';

export default function RecruiterDashboardView({ activeTab }) {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const loadApplications = () => {
    setLoading(true);
    getAllApplications()
      .then((res) => setApplications(res.data || []))
      .catch((err) => setAlert({ type: 'error', message: err.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleStageUpdate = async (appId, newStatus) => {
    const feedback = newStatus === 'Shortlisted'
      ? 'Strong technical skills; shortlisted for technical round.'
      : newStatus === 'Interview Scheduled'
        ? 'Interview scheduled via PES Placement Cell.'
        : 'Thank you for applying.';

    try {
      await updateApplicationStatus(appId, newStatus, feedback);
      setAlert({ type: 'success', message: `Candidate marked as ${newStatus}` });
      loadApplications();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  if (activeTab === 'post-internship') {
    return <PostInternshipForm onCreated={loadApplications} />;
  }

  const visibleApps = statusFilter === 'All'
    ? applications
    : applications.filter((a) => (a.status || '').toLowerCase() === statusFilter.toLowerCase());

  return (
    <div>
      {alert && <AlertBanner alert={alert} onClose={() => setAlert(null)} />}

      <div className="card">
        <div className="card-title">
          <span>Candidate Application Review</span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['All', 'Shortlisted', 'Interview Scheduled', 'Rejected'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`btn btn-sm ${statusFilter === tab ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading candidate submissions..." />
        ) : visibleApps.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No applications found for filter "{statusFilter}".</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Internship</th>
                  <th>Status</th>
                  <th>Cover Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleApps.map((app) => {
                  const id = app._id || app.id;
                  return (
                    <tr key={id}>
                      <td>{app.studentName || app.studentEmail || 'Student'}</td>
                      <td>{app.internshipTitle || 'Software Intern'}</td>
                      <td><StatusBadge label={app.status || 'Submitted'} /></td>
                      <td>{app.coverNote || '—'}</td>
                      <td style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <button type="button" className="btn btn-success btn-sm" onClick={() => handleStageUpdate(id, 'Shortlisted')}>Shortlist</button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => handleStageUpdate(id, 'Interview Scheduled')}>Interview</button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleStageUpdate(id, 'Rejected')}>Reject</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
