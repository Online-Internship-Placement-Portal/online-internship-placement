/**
 * Admin User Governance & Directory Table
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-018, TC-Admin-01
 */

import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge';

export default function UserManagementTable({ users = [], onToggleStatus }) {
  const [search, setSearch] = useState('');

  const filtered = users.filter(
    (u) =>
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-title">
        <span>Platform Users ({filtered.length})</span>
        <input
          type="text"
          className="form-input"
          style={{ maxWidth: '260px' }}
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user._id || user.id || user.email}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><StatusBadge label={user.role} /></td>
                <td><StatusBadge label={user.active === false ? 'Closed' : 'Open'} /></td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onToggleStatus(user._id || user.id)}
                  >
                    {user.active === false ? 'Activate' : 'Deactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
