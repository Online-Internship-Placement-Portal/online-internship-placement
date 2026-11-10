/**
 * Student Command Center Dashboard
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-014, IPR-F-015
 */

import React, { useState, useEffect } from 'react';
import { getMyProgress, updateTopicProgress } from '../../services/testService';
import { getMyApplications } from '../../services/internshipService';
import PreparationGauge from './PreparationGauge';
import PrepChecklist from './PrepChecklist';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertBanner from '../common/AlertBanner';

export default function StudentDashboardView() {
  const [progress, setProgress] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [progRes, appRes] = await Promise.all([getMyProgress(), getMyApplications()]);
      setProgress(progRes.data);
      setApplications(appRes.data || []);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Unable to load dashboard.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleToggleTopic = async (topic, completed) => {
    try {
      await updateTopicProgress(topic, completed, completed ? 85 : 0);
      setAlert({ type: 'success', message: `Updated progress for "${topic}"` });
      loadDashboard();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  if (loading) return <LoadingSpinner label="Loading student command center..." />;

  const analytics = progress?.analytics || { overallPercentage: 0, categoryBreakdown: [] };
  const topics = progress?.topics || [];

  return (
    <div>
      {alert && <AlertBanner alert={alert} onClose={() => setAlert(null)} />}

      <div className="grid-3">
        <div className="card stat-card">
          <span className="stat-label">Applications Submitted</span>
          <strong className="stat-value">{applications.length}</strong>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Shortlisted / Interviews</span>
          <strong className="stat-value">
            {applications.filter((a) => ['Shortlisted', 'Interview Scheduled', 'Selected'].includes(a.status)).length}
          </strong>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Placement Readiness</span>
          <strong className="stat-value">{analytics.overallPercentage}%</strong>
        </div>
      </div>

      <PreparationGauge
        overallPercentage={analytics.overallPercentage}
        categoryBreakdown={analytics.categoryBreakdown}
      />

      <PrepChecklist topics={topics} onToggleTopic={handleToggleTopic} />
    </div>
  );
}
