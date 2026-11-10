/**
 * Internship Search & Multi-Criteria Filter Bar
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-007, TC-Int-02
 */

import React from 'react';

export default function InternshipFilterBar({
  search,
  onSearchChange,
  roleFilter,
  onRoleChange,
  locationFilter,
  onLocationChange
}) {
  return (
    <div className="card filter-bar">
      <div className="grid-3">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="filter-search">Keyword Search</label>
          <input
            id="filter-search"
            type="text"
            className="form-input"
            placeholder="Search company, title, or skill..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="filter-role">Role Domain</label>
          <select id="filter-role" className="form-select" value={roleFilter} onChange={(e) => onRoleChange(e.target.value)}>
            <option value="">All Roles</option>
            <option value="SWE">Software Engineering</option>
            <option value="AI/ML">AI &amp; Machine Learning</option>
            <option value="DevOps">Cloud &amp; DevOps</option>
            <option value="Full Stack">Full Stack Web</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="filter-loc">Work Location</label>
          <select id="filter-loc" className="form-select" value={locationFilter} onChange={(e) => onLocationChange(e.target.value)}>
            <option value="">All Locations</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
      </div>
    </div>
  );
}
