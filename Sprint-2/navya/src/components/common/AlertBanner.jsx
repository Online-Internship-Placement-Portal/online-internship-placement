/**
 * Dismissible Alert Notification Banner
 * Author: NAVYA R (PES2UG24CS308)
 */

import React from 'react';

export default function AlertBanner({ alert, onClose }) {
  if (!alert || !alert.message) return null;

  const isError = alert.type === 'error';
  const styleClass = isError ? 'alert-banner alert-error' : 'alert-banner alert-success';

  return (
    <div className={styleClass} role="alert">
      <span>
        <strong>{isError ? 'Notice: ' : 'Success: '}</strong>
        {alert.message}
      </span>
      {onClose && (
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onClose}
          aria-label="Close alert"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
