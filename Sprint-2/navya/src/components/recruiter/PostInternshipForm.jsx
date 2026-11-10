/**
 * Recruiter Internship Posting Form Component
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-016, TC-Rec-01
 */

import React, { useState } from 'react';
import { createInternship } from '../../services/internshipService';
import AlertBanner from '../common/AlertBanner';

export default function PostInternshipForm({ onCreated }) {
  const [form, setForm] = useState({
    company: '',
    title: '',
    role: 'SWE',
    location: 'Bengaluru',
    stipend: 75000,
    minCgpa: 8.0,
    openings: 5,
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setSubmitting(true);

    try {
      await createInternship({
        ...form,
        stipend: Number(form.stipend),
        minCgpa: Number(form.minCgpa),
        openings: Number(form.openings)
      });
      setAlert({ type: 'success', message: `Internship "${form.title}" published successfully!` });
      setForm({ company: '', title: '', role: 'SWE', location: 'Bengaluru', stipend: 75000, minCgpa: 8.0, openings: 5, description: '' });
      if (onCreated) onCreated();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Could not publish internship.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-title">
        <span>Post New Internship Opening</span>
      </div>

      {alert && <AlertBanner alert={alert} onClose={() => setAlert(null)} />}

      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="post-company">Company Name</label>
            <input id="post-company" className="form-input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="post-title">Job Title</label>
            <input id="post-title" className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
        </div>

        <div className="grid-4">
          <div className="form-group">
            <label className="form-label" htmlFor="post-role">Domain</label>
            <select id="post-role" className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="SWE">SWE</option>
              <option value="AI/ML">AI/ML</option>
              <option value="DevOps">DevOps</option>
              <option value="Full Stack">Full Stack</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="post-loc">Location</label>
            <input id="post-loc" className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="post-stipend">Monthly Stipend (₹)</label>
            <input id="post-stipend" type="number" className="form-input" value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="post-cgpa">Min CGPA</label>
            <input id="post-cgpa" type="number" step="0.1" className="form-input" value={form.minCgpa} onChange={(e) => setForm({ ...form, minCgpa: e.target.value })} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="post-desc">Role Description &amp; Requirements</label>
          <textarea id="post-desc" rows="3" className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Publishing...' : '+ Publish Opening'}
        </button>
      </form>
    </div>
  );
}
