/**
 * Administrator Governance & System Metrics Dashboard
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-018, TC-Admin-01
 */

import React, { useState, useEffect } from 'react';
import { getAdminMetrics, getAdminUsers, toggleUserStatus } from '../../services/testService';
import UserManagementTable from './UserManagementTable';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertBanner from '../common/AlertBanner';

export default function AdminDashboardView({ activeTab }) {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const loadGovernance = async () => {
    setLoading(true);
    try {
      const [mRes, uRes] = await Promise.all([getAdminMetrics(), getAdminUsers()]);
      setMetrics(mRes.data);
      setUsers(uRes.data || []);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Unable to load governance metrics.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGovernance();
  }, []);

  const handleToggleUser = async (userId) => {
    try {
      await toggleUserStatus(userId);
      setAlert({ type: 'success', message: 'User account status updated.' });
      loadGovernance();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  if (loading) return <LoadingSpinner label="Loading admin governance console..." />;

  return (
    <div>
      {alert && <AlertBanner alert={alert} onClose={() => setAlert(null)} />}

      <div className="grid-4">
        <div className="card stat-card">
          <span className="stat-label">Total Users</span>
          <strong className="stat-value">{metrics?.totalUsers || users.length}</strong>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Active Internships</span>
          <strong className="stat-value">{metrics?.activeInternships || 0}</strong>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Applications</span>
          <strong className="stat-value">{metrics?.totalApplications || 0}</strong>
        </div>
        <div className="card stat-card">
          <span className="stat-label">System Status</span>
          <strong className="stat-value" style={{ fontSize: '1.1rem', color: 'var(--success)' }}>
            99.9% UP
          </strong>
        </div>
      </div>

      {(activeTab === 'admin-users' || activeTab === 'dashboard') && (
        <UserManagementTable users={users} onToggleStatus={handleToggleUser} />
      )}

      {activeTab === 'admin-tests' && (
        <div className="card">
          <div className="card-title">
            <span>Question Bank Governance</span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage campus aptitude assessments, passing thresholds, and technical MCQ categories.
          </p>
        </div>
      )}
    </div>
  );
}
