/**
 * Sprint-2 Master React Application Component
 * Author: NAVYA R (PES2UG24CS308)
 * Role: User Interface (Frontend)
 * Traceability: IPR-NF-004, IPR-F-001 through IPR-F-018
 */

import React, { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('portal_token') || null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alert, setAlert] = useState(null);

  // Load session
  useEffect(() => {
    const savedUser = localStorage.getItem('portal_user');
    if (savedUser && token) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, [token]);

  const handleLogin = (user, jwtToken) => {
    setCurrentUser(user);
    setToken(jwtToken);
    localStorage.setItem('portal_token', jwtToken);
    localStorage.setItem('portal_user', JSON.stringify(user));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.clear();
    setActiveTab('login');
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <a href="#home" className="brand-logo" onClick={() => setActiveTab('dashboard')}>
            🎓 PES Placement Portal <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#3730a3', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Sprint-2 Final</span>
          </a>
          <div className="nav-links">
            {!currentUser ? (
              <>
                <button className={`btn ${activeTab === 'login' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('login')}>Sign In</button>
                <button className={`btn ${activeTab === 'register' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('register')}>Register (Student)</button>
              </>
            ) : (
              <>
                <button className={`btn btn-secondary ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                {currentUser.role === 'student' && (
                  <>
                    <button className={`btn btn-secondary ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>My Profile</button>
                    <button className={`btn btn-secondary ${activeTab === 'internships' ? 'active' : ''}`} onClick={() => setActiveTab('internships')}>Browse Internships</button>
                    <button className={`btn btn-secondary ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>My Applications</button>
                    <button className={`btn btn-secondary ${activeTab === 'tests' ? 'active' : ''}`} onClick={() => setActiveTab('tests')}>Aptitude Tests</button>
                    <button className={`btn btn-secondary ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Test History</button>
                  </>
                )}
                {currentUser.role === 'recruiter' && (
                  <>
                    <button className={`btn btn-secondary ${activeTab === 'post-internship' ? 'active' : ''}`} onClick={() => setActiveTab('post-internship')}>+ Post Internship</button>
                    <button className={`btn btn-secondary ${activeTab === 'recruiter-applicants' ? 'active' : ''}`} onClick={() => setActiveTab('recruiter-applicants')}>Candidate Applications</button>
                  </>
                )}
                {currentUser.role === 'admin' && (
                  <>
                    <button className={`btn btn-secondary ${activeTab === 'admin-users' ? 'active' : ''}`} onClick={() => setActiveTab('admin-users')}>User Management</button>
                    <button className={`btn btn-secondary ${activeTab === 'admin-tests' ? 'active' : ''}`} onClick={() => setActiveTab('admin-tests')}>Manage Tests</button>
                  </>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentUser.name}</span>
                  <span className="badge badge-submitted">{currentUser.role}</span>
                  <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="main-content">
        {alert && (
          <div className={`alert ${alert.type === 'error' ? 'badge-rejected' : 'badge-shortlisted'}`} style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px' }}>
            {alert.message}
          </div>
        )}

        {/* Dynamic Views rendered per role and active tab */}
        {!currentUser && activeTab === 'register' && <StudentRegisterView onRegistered={() => setActiveTab('login')} />}
        {!currentUser && activeTab !== 'register' && <LoginView onLogin={handleLogin} />}

        {currentUser && activeTab === 'dashboard' && currentUser.role === 'student' && <StudentDashboardView token={token} />}
        {currentUser && activeTab === 'profile' && currentUser.role === 'student' && <StudentProfileView token={token} />}
        {currentUser && activeTab === 'internships' && <InternshipCatalogView token={token} />}
        {currentUser && activeTab === 'applications' && <ApplicationTrackerView token={token} />}
        {currentUser && activeTab === 'tests' && <AptitudeTestView token={token} />}
        {currentUser && activeTab === 'history' && <TestHistoryView token={token} />}

        {currentUser && currentUser.role === 'recruiter' && <RecruiterDashboardView activeTab={activeTab} token={token} />}
        {currentUser && currentUser.role === 'admin' && <AdminDashboardView activeTab={activeTab} token={token} />}
      </main>

      <footer style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.85rem', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
        Online Internship & Placement Preparation Portal • Sprint-2 Final Release • Department of CSE, PES University
      </footer>
    </div>
  );
}

// Subcomponents definitions placeholder exported
function LoginView({ onLogin }) { return <div className="card"><h3>Login Module</h3></div>; }
function StudentRegisterView({ onRegistered }) { return <div className="card"><h3>Student Register Module</h3></div>; }
function StudentDashboardView({ token }) { return <div className="card"><h3>Student Dashboard</h3></div>; }
function StudentProfileView({ token }) { return <div className="card"><h3>Student Profile Editor</h3></div>; }
function InternshipCatalogView({ token }) { return <div className="card"><h3>Internship Catalog</h3></div>; }
function ApplicationTrackerView({ token }) { return <div className="card"><h3>Application Status Pipeline</h3></div>; }
function AptitudeTestView({ token }) { return <div className="card"><h3>Aptitude Test Engine</h3></div>; }
function TestHistoryView({ token }) { return <div className="card"><h3>Test History & Score Trends</h3></div>; }
function RecruiterDashboardView({ activeTab, token }) { return <div className="card"><h3>Recruiter Management Hub</h3></div>; }
function AdminDashboardView({ activeTab, token }) { return <div className="card"><h3>Admin Governance Hub</h3></div>; }
