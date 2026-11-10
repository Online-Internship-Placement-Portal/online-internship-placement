/**
 * Interactive Preparation Topic Checklist
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-014, TC-Prog-01
 */

import React from 'react';

export default function PrepChecklist({ topics = [], onToggleTopic }) {
  return (
    <div className="card">
      <div className="card-title">
        <span>Preparation Syllabus Checklist</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {topics.filter((t) => t.completed).length} / {topics.length} Completed
        </span>
      </div>

      <div className="checklist-stack">
        {topics.map((item) => (
          <label key={item.topic} className="checklist-item">
            <input
              type="checkbox"
              checked={Boolean(item.completed)}
              onChange={(e) => onToggleTopic(item.topic, e.target.checked)}
            />
            <span className={item.completed ? 'topic-done' : ''}>{item.topic}</span>
            <span className="badge badge-submitted" style={{ marginLeft: 'auto' }}>
              {item.category || 'Core CS'}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
