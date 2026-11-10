/**
 * Student Registration Form Component
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-001, TC-Auth-01
 */

import React, { useState } from 'react';
import { registerStudent } from '../../services/authService';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import AlertBanner from '../common/AlertBanner';

const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Artificial Intelligence & Machine Learning',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering'
];

export default function StudentRegisterView({ onRegistered }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: DEPARTMENTS[0],
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) return setError('Full name is required.');
    if (!isValidEmail(form.email)) return setError('Enter a valid email address.');
    if (!isValidPassword(form.password)) return setError('Password must be at least 6 characters.');

    setLoading(true);
    try {
      await registerStudent(form);
      onRegistered();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card card">
      <div className="card-title">
        <span>Student Account Registration</span>
      </div>

      {error && <AlertBanner alert={{ type: 'error', message: error }} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-name">Full Name</label>
          <input id="reg-name" className="form-input" value={form.name} onChange={handleChange('name')} placeholder="Navya R" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-email">PES Email</label>
          <input id="reg-email" type="email" className="form-input" value={form.email} onChange={handleChange('email')} placeholder="navya@pes.edu" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-dept">Department</label>
          <select id="reg-dept" className="form-select" value={form.department} onChange={handleChange('department')}>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-pass">Password (min 6 chars)</label>
          <input id="reg-pass" type="password" className="form-input" value={form.password} onChange={handleChange('password')} required />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register Student'}
        </button>
      </form>
    </div>
  );
}
