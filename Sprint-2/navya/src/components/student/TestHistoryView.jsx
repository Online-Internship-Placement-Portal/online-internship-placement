/**
 * Test History & Score Trend Table
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-013, TC-Test-03
 */

import React, { useState, useEffect } from 'react';
import { getTestHistory } from '../../services/testService';
import StatusBadge from '../common/StatusBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertBanner from '../common/AlertBanner';

export default function TestHistoryView() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTestHistory()
      .then((res) => setHistory(res.data || []))
      .catch((err) => setError(err.message || 'Could not load test history.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading attempt history..." />;

  return (
    <div className="card">
      <div className="card-title">
        <span>Aptitude Assessment History</span>
        <span className="badge badge-submitted">{history.length} Attempts</span>
      </div>

      {error && <AlertBanner alert={{ type: 'error', message: error }} onClose={() => setError('')} />}

      {history.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No test attempts recorded yet.</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Verdict</th>
                <th>Attempted On</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={item._id || idx}>
                  <td>{item.testTitle || item.testId || 'General Aptitude'}</td>
                  <td>{item.score} / {item.totalQuestions || 5}</td>
                  <td><strong>{item.percentage}%</strong></td>
                  <td><StatusBadge label={item.passed ? 'Selected' : 'Rejected'} /></td>
                  <td>{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'Oct 2026'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
