/**
 * Status & Role Badge Component
 * Author: NAVYA R (PES2UG24CS308)
 */

import React from 'react';

const STATUS_CLASS_MAP = {
  submitted: 'badge-submitted',
  applied: 'badge-submitted',
  'under review': 'badge-review',
  shortlisted: 'badge-shortlisted',
  'interview scheduled': 'badge-interview',
  selected: 'badge-selected',
  rejected: 'badge-rejected',
  open: 'badge-open',
  closed: 'badge-closed',
  student: 'badge-submitted',
  recruiter: 'badge-interview',
  admin: 'badge-selected'
};

export default function StatusBadge({ label }) {
  const key = (label || '').toLowerCase();
  const variant = STATUS_CLASS_MAP[key] || 'badge-submitted';

  return <span className={`badge ${variant}`}>{label}</span>;
}
