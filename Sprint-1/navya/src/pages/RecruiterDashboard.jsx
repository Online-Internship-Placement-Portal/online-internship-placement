/**
 * Recruiter Dashboard Component
 * Author: Navya R (PES2UG24CS308)
 * Role: User Interface (Frontend)
 * Traceability: SRS Section 3.1 Recruiter Interface, IPR-F-016, IPR-F-017, TC-Rec-01, TC-Rec-02
 */

import React, { useState, useEffect } from 'react';

const RecruiterDashboard = ({ currentUser, token }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [newInternship, setNewInternship] = useState({
    title: '',
    company: 'Google',
    description: '',
    location: 'Bengaluru, India',
    type: 'Full-time',
    stipend: '₹80,000 / month',
    deadline: '2027-02-15'
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: `Application updated to ${newStatus}.`, type: 'success' });
        fetchApplications();
      }
    } catch (err) {
      setMessage({ text: 'Status update failed.', type: 'error' });
    }
  };

  const handleCreateInternship = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newInternship)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'New internship posting created successfully!', type: 'success' });
        setFormOpen(false);
        setNewInternship({
          title: '',
          company: 'Google',
          description: '',
          location: 'Bengaluru, India',
          type: 'Full-time',
          stipend: '₹80,000 / month',
          deadline: '2027-02-15'
        });
      }
    } catch (err) {
      setMessage({ text: 'Failed to create internship.', type: 'error' });
    }
  };

  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', color: '#ffffff' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Recruiter Portal - Candidate Evaluation</h1>
        <p style={{ opacity: 0.9, marginTop: '0.25rem' }}>
          Logged in as: {currentUser.name} ({currentUser.email})
        </p>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button className="btn btn-primary" onClick={() => setFormOpen(!formOpen)}>
          {formOpen ? 'Cancel' : '+ Post New Internship Opportunity'}
        </button>
      </div>

      {/* Post Internship Form (IPR-F-016 / TC-Rec-01) */}
      {formOpen && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Create Internship Listing</h3>
          <form onSubmit={handleCreateInternship}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Role Title</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Backend Node.js Intern"
                  value={newInternship.title}
                  onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={newInternship.company}
                  onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={newInternship.location}
                  onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select
                  className="form-select"
                  value={newInternship.type}
                  onChange={(e) => setNewInternship({ ...newInternship, type: e.target.value })}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Stipend</label>
                <input
                  type="text"
                  className="form-input"
                  value={newInternship.stipend}
                  onChange={(e) => setNewInternship({ ...newInternship, stipend: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={newInternship.deadline}
                  onChange={(e) => setNewInternship({ ...newInternship, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role Description</label>
              <textarea
                className="form-textarea"
                rows="3"
                required
                placeholder="Describe role responsibilities and qualifications..."
                value={newInternship.description}
                onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-success">
              Publish Internship
            </button>
          </form>
        </div>
      )}

      {/* Candidate Evaluation & Status Workflow (IPR-F-017 / TC-Rec-02) */}
      <div className="card">
        <h2 className="card-title">Applicant Evaluation & Status Management</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Evaluate applicant profiles and update application statuses (Shortlist / Reject)
        </p>

        {loading ? (
          <div>Loading applicant records...</div>
        ) : applications.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No applications received yet.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Target Internship</th>
                <th>Current Status</th>
                <th>Applied Date</th>
                <th>Recruiter Action (IPR-F-017)</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const appId = app.id || app._id;
                return (
                  <tr key={appId}>
                    <td>
                      <strong>{app.student?.name || 'Student Candidate'}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {app.student?.email || 'student@pes.edu'}
                      </div>
                    </td>
                    <td>{app.internship?.title || 'Internship Role'}</td>
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
                    <td>{new Date(app.appliedDate || Date.now()).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-success"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                          onClick={() => handleStatusUpdate(appId, 'Shortlisted')}
                        >
                          Shortlist
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                          onClick={() => handleStatusUpdate(appId, 'Rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
