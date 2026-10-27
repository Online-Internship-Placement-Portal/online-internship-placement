/**
 * Navigation Bar Component
 * Author: Navya R (PES2UG24CS308)
 * Role: User Interface (Frontend)
 * Traceability: SRS Section 3.1, IPR-NF-004
 */

import React from 'react';

const Navbar = ({ currentUser, onLogout, currentTab, setCurrentTab }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#home" onClick={() => setCurrentTab('dashboard')} className="brand-logo">
          🎓 PES Placement Portal
        </a>

        {currentUser ? (
          <ul className="nav-links">
            <li>
              <button
                className={`btn btn-secondary nav-link ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentTab('dashboard')}
              >
                Dashboard
              </button>
            </li>

            {currentUser.role === 'student' && (
              <>
                <li>
                  <button
                    className={`btn btn-secondary nav-link ${currentTab === 'internships' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('internships')}
                  >
                    Browse Internships
                  </button>
                </li>
                <li>
                  <button
                    className={`btn btn-secondary nav-link ${currentTab === 'tests' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('tests')}
                  >
                    Aptitude Tests
                  </button>
                </li>
              </>
            )}

            {currentUser.role === 'recruiter' && (
              <li>
                <button
                  className={`btn btn-secondary nav-link ${currentTab === 'post-internship' ? 'active' : ''}`}
                  onClick={() => setCurrentTab('post-internship')}
                >
                  + Post Internship
                </button>
              </li>
            )}

            <li className="user-badge">
              <span>{currentUser.name}</span>
              <span className="role-pill">{currentUser.role}</span>
              <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem' }}>
                Logout
              </button>
            </li>
          </ul>
        ) : (
          <div className="nav-links">
            <button
              className={`btn ${currentTab === 'login' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentTab('login')}
            >
              Sign In
            </button>
            <button
              className={`btn ${currentTab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentTab('register')}
            >
              Register (Student)
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
