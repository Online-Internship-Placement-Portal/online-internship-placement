/**
 * Student Dashboard Component
 * Author: Navya R (PES2UG24CS308)
 * Role: User Interface (Frontend)
 * Traceability: SRS Section 3.1 Student Interface, IPR-F-010, IPR-F-014, IPR-F-015
 */

import React, { useState, useEffect } from 'react';

const StudentDashboard = ({ currentUser, token, onNavigate }) => {
  const [progress, setProgress] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch preparation progress (IPR-F-014, IPR-F-015)
      const progRes = await fetch('/api/progress/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const progData = await progRes.json();
      if (progData.success) {
        setProgress(progData.data);
      }

      // 2. Fetch applied internships & statuses (IPR-F-010)
      const appsRes = await fetch('/api/applications/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const appsData = await appsRes.json();
      if (appsData.success) {
        setApplications(appsData.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: '#ffffff' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Welcome, {currentUser.name}! 👋</h1>
        <p style={{ opacity: 0.9, marginTop: '0.25rem' }}>
          Department: {currentUser.department || 'Computer Science & Engineering'} • Student Portal
        </p>
      </div>

      <div className="grid-3">
        <div className="stat-box">
          <span className="stat-num">{applications.length}</span>
          <span className="stat-label">Internship Applications</span>
        </div>
        <div className="stat-box">
          <span className="stat-num">
            {progress?.analytics?.overallPercentage ?? 65}%
          </span>
          <span className="stat-label">Placement Preparation Completed</span>
        </div>
        <div className="stat-box">
          <span className="stat-num">
            {progress?.analytics?.averageScore ?? 84}/100
          </span>
          <span className="stat-label">Average Practice Assessment Score</span>
        </div>
      </div>

      {/* Placement Preparation Analytics (IPR-F-014, IPR-F-015) */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="card-title">Placement Preparation Progress</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Readiness Status:{' '}
              <strong style={{ color: 'var(--primary)' }}>
                {progress?.analytics?.readinessStatus || 'In Progress'}
              </strong>
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => onNavigate('tests')}>
            Take Practice Assessment
          </button>
        </div>

        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress?.analytics?.overallPercentage ?? 65}%` }}
          ></div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Preparation Topic</th>
                <th>Category</th>
                <th>Status</th>
                <th>Benchmark Score</th>
              </tr>
            </thead>
            <tbody>
              {progress?.topics?.map((topic) => (
                <tr key={topic.id || topic.topic}>
                  <td><strong>{topic.topic}</strong></td>
                  <td>{topic.category}</td>
                  <td>
                    {topic.completed ? (
                      <span className="badge-shortlisted">Completed</span>
                    ) : (
                      <span className="badge-submitted">In Progress</span>
                    )}
                  </td>
                  <td>{topic.score}%</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading topics...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Status Tracking (IPR-F-010 / TC-Int-05) */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="card-title">My Internship Applications</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Real-time application status tracker (Submitted, Shortlisted, Rejected)
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('internships')}>
            Search More Internships
          </button>
        </div>

        {applications.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            You have not applied for any internships yet. Click "Search More Internships" to discover openings.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Location</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id || app._id}>
                  <td><strong>{app.internship?.company || 'Company'}</strong></td>
                  <td>{app.internship?.title || 'Internship Role'}</td>
                  <td>{app.internship?.location || 'Bengaluru'}</td>
                  <td>{new Date(app.appliedDate || Date.now()).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={
                        app.status === 'Shortlisted'
                          ? 'badge-shortlisted'
                          : app.status === 'Rejected'
                          ? 'badge-rejected'
                          : 'badge-submitted'
                      }
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
