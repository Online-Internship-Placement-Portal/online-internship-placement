/**
 * Internship List & Application Discovery Component
 * Author: Navya R (PES2UG24CS308)
 * Role: User Interface (Frontend)
 * Traceability: IPR-F-006, IPR-F-007, IPR-F-008, IPR-F-009, TC-Int-01, TC-Int-02, TC-Int-03, TC-Int-04
 */

import React, { useState, useEffect } from 'react';

const InternshipList = ({ token }) => {
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    fetchInternships();
  }, [typeFilter]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      let url = `/api/internships?search=${encodeURIComponent(search)}`;
      if (typeFilter !== 'All') {
        url += `&type=${encodeURIComponent(typeFilter)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setInternships(data.data);
      }
    } catch (err) {
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const handleApply = async (internshipId, companyName, title) => {
    setMessage({ text: '', type: '' });
    setApplyingId(internshipId);

    try {
      const res = await fetch(`/api/internships/${internshipId}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          resume: 'https://storage.portal.pes.edu/resumes/default.pdf',
          coverNote: `Application for ${title} at ${companyName}`
        })
      });

      const data = await res.json();

      if (res.status === 409) {
        // DUPLICATE APPLICATION DETECTED (IPR-F-009 / TC-Int-04)
        setMessage({
          text: `⚠️ Duplicate Application: You have already applied for ${companyName} (${title}). Duplicate submission is prevented.`,
          type: 'error'
        });
      } else if (!res.ok || !data.success) {
        throw new Error(data.message || 'Application submission failed.');
      } else {
        // SUCCESSFUL APPLICATION (IPR-F-008 / TC-Int-03)
        setMessage({
          text: `🎉 Success! Your application for ${companyName} (${title}) has been submitted. Status: Submitted`,
          type: 'success'
        });
      }
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div>
      <div className="card">
        <h1 className="card-title">Internship Opportunities</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Discover available corporate internships, search and filter by role and apply directly.
        </p>

        {/* Search & Filter Bar (IPR-F-007) */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: '1', minWidth: '220px' }}
            placeholder="Search by company, title, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select"
            style={{ width: '160px' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading internship listings...</div>
      ) : internships.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No internships match your current search query.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {internships.map((internship) => {
            const internId = internship.id || internship._id;
            return (
              <div key={internId} className="card" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {internship.title}
                    </h3>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.2rem' }}>
                      🏢 {internship.company}
                    </div>
                  </div>
                  <span className="role-pill" style={{ background: '#ecfdf5', color: '#065f46' }}>
                    {internship.type}
                  </span>
                </div>

                <p style={{ color: '#475569', fontSize: '0.925rem', margin: '0.75rem 0' }}>
                  {internship.description}
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <span>📍 {internship.location}</span>
                  <span>💰 {internship.stipend}</span>
                  <span>📅 Apply before: {new Date(internship.deadline).toLocaleDateString()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-primary"
                    disabled={applyingId === internId}
                    onClick={() => handleApply(internId, internship.company, internship.title)}
                  >
                    {applyingId === internId ? 'Submitting Application...' : 'Apply for Internship'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InternshipList;
