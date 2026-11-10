/**
 * Loading Indicator Component
 * Author: NAVYA R (PES2UG24CS308)
 */

import React from 'react';

export default function LoadingSpinner({ label = 'Loading data...' }) {
  return (
    <div className="card loading-box" role="status" aria-live="polite">
      <div className="spinner-ring" />
      <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
        {label}
      </p>
    </div>
  );
}
