/**
 * Student Profile Editor Component
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-004, IPR-F-005, TC-Prof-01, TC-Prof-02
 */

import React, { useState, useEffect } from 'react';
import { getMyProfile, updateMyProfile } from '../../services/testService';
import { isValidCGPA, isValidUSN, isValidUrl } from '../../utils/validators';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertBanner from '../common/AlertBanner';

export default function StudentProfileView() {
  const [profile, setProfile] = useState({
    usn: '',
    cgpa: '',
    semester: 5,
    skills: '',
    resumeUrl: '',
    portfolioUrl: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        const d = res.data || {};
        setProfile({
          usn: d.usn || '',
          cgpa: d.cgpa ?? '',
          semester: d.semester || 5,
          skills: Array.isArray(d.skills) ? d.skills.join(', ') : '',
          resumeUrl: d.resumeUrl || '',
          portfolioUrl: d.portfolioUrl || '',
          bio: d.bio || ''
        });
      })
      .catch((err) => setAlert({ type: 'error', message: err.message }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (profile.usn && !isValidUSN(profile.usn)) {
      return setAlert({ type: 'error', message: 'Invalid USN format (expected e.g. PES2UG24CS308).' });
    }
    if (!isValidCGPA(profile.cgpa)) {
      return setAlert({ type: 'error', message: 'CGPA must be between 0.00 and 10.00.' });
    }
    if (!isValidUrl(profile.resumeUrl) || !isValidUrl(profile.portfolioUrl)) {
      return setAlert({ type: 'error', message: 'Please enter valid URLs for resume or portfolio.' });
    }

    setSaving(true);
    try {
      const payload = {
        usn: profile.usn.trim(),
        cgpa: Number(profile.cgpa),
        semester: Number(profile.semester),
        skills: profile.skills.split(',').map((s) => s.trim()).filter(Boolean),
        resumeUrl: profile.resumeUrl.trim(),
        portfolioUrl: profile.portfolioUrl.trim(),
        bio: profile.bio.trim()
      };
      await updateMyProfile(payload);
      setAlert({ type: 'success', message: 'Placement profile updated successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading academic profile..." />;

  return (
    <div className="card">
      <div className="card-title">
        <span>Academic &amp; Placement Profile</span>
      </div>

      {alert && <AlertBanner alert={alert} onClose={() => setAlert(null)} />}

      <form onSubmit={handleSave}>
        <div className="grid-3">
          <div className="form-group">
            <label className="form-label" htmlFor="prof-usn">University Seat Number (USN)</label>
            <input id="prof-usn" className="form-input" value={profile.usn} onChange={(e) => setProfile({ ...profile, usn: e.target.value })} placeholder="PES2UG24CS308" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prof-cgpa">Current CGPA</label>
            <input id="prof-cgpa" type="number" step="0.01" className="form-input" value={profile.cgpa} onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prof-sem">Current Semester</label>
            <input id="prof-sem" type="number" min="1" max="8" className="form-input" value={profile.semester} onChange={(e) => setProfile({ ...profile, semester: e.target.value })} required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="prof-skills">Technical Skills (comma-separated)</label>
          <input id="prof-skills" className="form-input" value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} placeholder="React.js, Node.js, MongoDB" />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="prof-resume">Resume URL</label>
            <input id="prof-resume" className="form-input" value={profile.resumeUrl} onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })} placeholder="https://..." />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prof-port">GitHub / Portfolio URL</label>
            <input id="prof-port" className="form-input" value={profile.portfolioUrl} onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })} placeholder="https://github.com/..." />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="prof-bio">Career Objective / Bio</label>
          <textarea id="prof-bio" rows="3" className="form-textarea" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving Profile...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
