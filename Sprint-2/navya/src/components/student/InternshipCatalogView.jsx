/**
 * Internship Catalog & 1-Click Application View
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-006, IPR-F-007, IPR-F-008, IPR-F-009, TC-Int-01..04
 */

import React, { useState, useEffect } from 'react';
import { getInternships, applyToInternship } from '../../services/internshipService';
import { useDebounce } from '../../hooks/useDebounce';
import { formatCurrencyINR } from '../../utils/validators';
import InternshipFilterBar from './InternshipFilterBar';
import StatusBadge from '../common/StatusBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertBanner from '../common/AlertBanner';

export default function InternshipCatalogView() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [alert, setAlert] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setLoading(true);
    getInternships({ search: debouncedSearch, role: roleFilter, location: locationFilter })
      .then((res) => setInternships(res.data || []))
      .catch((err) => setAlert({ type: 'error', message: err.message }))
      .finally(() => setLoading(false));
  }, [debouncedSearch, roleFilter, locationFilter]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      await applyToInternship(selectedJob._id || selectedJob.id, coverNote);
      setAlert({ type: 'success', message: `Successfully applied to ${selectedJob.company} — ${selectedJob.title}!` });
      setSelectedJob(null);
      setCoverNote('');
    } catch (err) {
      if (err.status === 409) {
        setAlert({ type: 'error', message: `Duplicate Blocked (409): You have already applied to ${selectedJob.company}.` });
      } else {
        setAlert({ type: 'error', message: err.message || 'Application failed.' });
      }
      setSelectedJob(null);
    }
  };

  return (
    <div>
      {alert && <AlertBanner alert={alert} onClose={() => setAlert(null)} />}

      <InternshipFilterBar
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
      />

      {loading ? (
        <LoadingSpinner label="Fetching open internship roles..." />
      ) : internships.length === 0 ? (
        <div className="card">
          <p style={{ color: 'var(--text-muted)' }}>No internships match your search filters.</p>
        </div>
      ) : (
        <div className="grid-2">
          {internships.map((job) => (
            <div key={job._id || job.id} className="card internship-card">
              <div className="card-title">
                <span>{job.title}</span>
                <StatusBadge label={job.status || 'Open'} />
              </div>
              <p className="company-line">
                <strong>{job.company}</strong> &bull; {job.location || 'Bengaluru'}
              </p>
              <p className="stipend-line">
                Stipend: <strong>{formatCurrencyINR(job.stipend)}</strong> &bull; Min CGPA: <strong>{job.minCgpa || 7.5}</strong>
              </p>
              <p className="job-desc">{job.description || 'Build scalable full-stack software systems.'}</p>

              <div className="job-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setSelectedJob(job);
                    setAlert(null);
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedJob && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="card modal-card">
            <div className="card-title">
              <span>Apply to {selectedJob.company}</span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedJob(null)}>Close</button>
            </div>
            <p style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>Role: <strong>{selectedJob.title}</strong></p>

            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label" htmlFor="cover-note">Cover Note / Statement of Purpose</label>
                <textarea
                  id="cover-note"
                  rows="3"
                  className="form-textarea"
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Briefly explain why you are a strong fit..."
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary">Confirm Application</button>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedJob(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
