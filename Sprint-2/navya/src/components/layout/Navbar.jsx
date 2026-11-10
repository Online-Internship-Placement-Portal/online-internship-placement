/**
 * Role-Aware Top Navigation Bar
 * Author: NAVYA R (PES2UG24CS308)
 */

import React from 'react';
import StatusBadge from '../common/StatusBadge';

export default function Navbar({ currentUser, activeTab, onSelectTab, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a
          href="#home"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('dashboard');
          }}
        >
          🎓 PES Placement Portal
          <span className="sprint-pill">Sprint-2 Final</span>
        </a>

        <div className="nav-links">
          {!currentUser ? (
            <>
              <button
                type="button"
                className={`btn ${activeTab === 'login' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onSelectTab('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`btn ${activeTab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onSelectTab('register')}
              >
                Register (Student)
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`btn btn-secondary ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onSelectTab('dashboard')}
              >
                Dashboard
              </button>

              {currentUser.role === 'student' && (
                <>
                  <button
                    type="button"
                    className={`btn btn-secondary ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => onSelectTab('profile')}
                  >
                    My Profile
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary ${activeTab === 'internships' ? 'active' : ''}`}
                    onClick={() => onSelectTab('internships')}
                  >
                    Browse Internships
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary ${activeTab === 'applications' ? 'active' : ''}`}
                    onClick={() => onSelectTab('applications')}
                  >
                    My Applications
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary ${activeTab === 'tests' ? 'active' : ''}`}
                    onClick={() => onSelectTab('tests')}
                  >
                    Aptitude Tests
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => onSelectTab('history')}
                  >
                    Test History
                  </button>
                </>
              )}

              {currentUser.role === 'recruiter' && (
                <>
                  <button
                    type="button"
                    className={`btn btn-secondary ${activeTab === 'post-internship' ? 'active' : ''}`}
                    onClick={() => onSelectTab('post-internship')}
                  >
                    + Post Internship
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary ${activeTab === 'recruiter-applicants' ? 'active' : ''}`}
                    onClick={() => onSelectTab('recruiter-applicants')}
                  >
                    Candidate Applications
                  </button>
                </>
              )}

              {currentUser.role === 'admin' && (
                <>
                  <button
                    type="button"
                    className={`btn btn-secondary ${activeTab === 'admin-users' ? 'active' : ''}`}
                    onClick={() => onSelectTab('admin-users')}
                  >
                    User Management
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary ${activeTab === 'admin-tests' ? 'active' : ''}`}
                    onClick={() => onSelectTab('admin-tests')}
                  >
                    Manage Tests
                  </button>
                </>
              )}

              <div className="user-chip">
                <span className="user-name">{currentUser.name}</span>
                <StatusBadge label={currentUser.role} />
                <button type="button" className="btn btn-secondary btn-sm" onClick={onLogout}>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
