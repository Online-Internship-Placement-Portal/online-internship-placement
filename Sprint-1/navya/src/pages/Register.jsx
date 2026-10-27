/**
 * Registration Component (Student Registration)
 * Author: Navya R (PES2UG24CS308)
 * Role: User Interface (Frontend)
 * Traceability: IPR-F-001, TC-Auth-01
 */

import React, { useState } from 'react';

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science and Engineering',
    phone: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      onRegisterSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2.5rem auto' }}>
      <div className="card">
        <div className="card-header" style={{ textAlign: 'center' }}>
          <h2 className="card-title">Student Registration</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Create your account to apply for internships & prepare for placements
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sohel Mahibubasa Chapparband"
            />
          </div>

          <div className="form-group">
            <label className="form-label">College Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. student@pes.edu"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department / Branch</label>
            <select name="department" className="form-select" value={formData.department} onChange={handleChange}>
              <option value="Computer Science and Engineering">Computer Science and Engineering</option>
              <option value="Information Science and Engineering">Information Science and Engineering</option>
              <option value="Electronics and Communication">Electronics and Communication</option>
              <option value="Artificial Intelligence and Machine Learning">Artificial Intelligence & ML</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91-9876543210"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password (Min. 6 characters)</label>
            <input
              type="password"
              name="password"
              className="form-input"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create strong password"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Registering Account...' : 'Create Student Account'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.875rem' }}>
          Already registered?{' '}
          <button
            onClick={onSwitchToLogin}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
