/**
 * Login Page Component
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-002, TC-Auth-02
 */

import React, { useState } from 'react';
import { loginUser } from '../../services/authService';
import { isValidEmail } from '../../utils/validators';
import AlertBanner from '../common/AlertBanner';

export default function LoginView({ onLogin, onSwitchRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid university or corporate email.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email.trim(), password);
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please check email and password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="auth-card card">
      <div className="card-title">
        <span>Sign In to Placement Portal</span>
      </div>

      {error && <AlertBanner alert={{ type: 'error', message: error }} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            className="form-input"
            placeholder="sohel@pes.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            className="form-input"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="demo-box">
        <p className="demo-label">Quick Demo Accounts:</p>
        <div className="demo-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => fillDemo('sohel@pes.edu', 'Password123')}>
            Student (Sohel)
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => fillDemo('recruiter@google.com', 'RecruiterPass123')}>
            Recruiter (Google)
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => fillDemo('admin@pes.edu', 'AdminPass123')}>
            Admin (PES)
          </button>
        </div>
      </div>

      {onSwitchRegister && (
        <p className="auth-switch">
          New student?{' '}
          <button type="button" className="link-btn" onClick={onSwitchRegister}>
            Create Student Account
          </button>
        </p>
      )}
    </div>
  );
}
