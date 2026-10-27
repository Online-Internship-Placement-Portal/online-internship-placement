/**
 * Main React Application Component
 * Author: Navya R (PES2UG24CS308)
 * Role: User Interface (Frontend)
 * Traceability: SRS Section 2.1 & 3.1, SAD Fig 1 Component Diagram
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import InternshipList from './pages/InternshipList';
import AptitudeTestView from './pages/AptitudeTestView';
import './styles.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentTab, setCurrentTab] = useState('login');

  useEffect(() => {
    // Restore saved session if present
    const savedToken = localStorage.getItem('portal_token');
    const savedUser = localStorage.getItem('portal_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setCurrentUser(JSON.parse(savedUser));
        setCurrentTab('dashboard');
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  const handleLoginSuccess = (user, jwtToken) => {
    setCurrentUser(user);
    setToken(jwtToken);
    localStorage.setItem('portal_token', jwtToken);
    localStorage.setItem('portal_user', JSON.stringify(user));
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('portal_token');
    localStorage.removeItem('portal_user');
    setCurrentTab('login');
  };

  const renderContent = () => {
    if (!currentUser) {
      if (currentTab === 'register') {
        return (
          <Register
            onRegisterSuccess={handleLoginSuccess}
            onSwitchToLogin={() => setCurrentTab('login')}
          />
        );
      }
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setCurrentTab('register')}
        />
      );
    }

    // Role-based views (IPR-F-003 / TC-Auth-03)
    if (currentTab === 'internships') {
      return <InternshipList token={token} />;
    }
    if (currentTab === 'tests') {
      return <AptitudeTestView token={token} />;
    }

    // Dashboard by role
    if (currentUser.role === 'recruiter') {
      return <RecruiterDashboard currentUser={currentUser} token={token} />;
    }
    if (currentUser.role === 'admin') {
      return <AdminDashboard currentUser={currentUser} token={token} />;
    }
    // Default: student dashboard
    return (
      <StudentDashboard
        currentUser={currentUser}
        token={token}
        onNavigate={(tab) => setCurrentTab(tab)}
      />
    );
  };

  return (
    <div className="app-container">
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <main className="main-content">{renderContent()}</main>
      <footer style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', borderTop: '1px solid var(--border)' }}>
        Online Internship & Placement Preparation Portal • Department of CSE, PES University (Sprint-1)
      </footer>
    </div>
  );
};

export default App;
