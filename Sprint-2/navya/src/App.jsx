/**
 * Sprint-2 Master React Application Component
 * Author: NAVYA R (PES2UG24CS308)
 * Role: User Interface (Frontend)
 * Traceability: IPR-NF-004, IPR-F-001 through IPR-F-018
 */

import React, { useState } from 'react';
import './styles.css';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AlertBanner from './components/common/AlertBanner';
import LoginView from './components/auth/LoginView';
import StudentRegisterView from './components/auth/StudentRegisterView';
import StudentDashboardView from './components/student/StudentDashboardView';
import StudentProfileView from './components/student/StudentProfileView';
import InternshipCatalogView from './components/student/InternshipCatalogView';
import ApplicationTrackerView from './components/student/ApplicationTrackerView';
import AptitudeTestView from './components/student/AptitudeTestView';
import TestHistoryView from './components/student/TestHistoryView';
import RecruiterDashboardView from './components/recruiter/RecruiterDashboardView';
import AdminDashboardView from './components/admin/AdminDashboardView';

export default function App() {
  const { currentUser, token, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alert, setAlert] = useState(null);

  const handleLogin = (user, jwtToken) => {
    login(user, jwtToken);
    setAlert({ type: 'success', message: `Welcome back, ${user.name}!` });
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    logout();
    setAlert(null);
    setActiveTab('login');
  };

  const handleRegistered = () => {
    setAlert({ type: 'success', message: 'Registration complete! Please sign in.' });
    setActiveTab('login');
  };

  return (
    <div className="app-container">
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <AlertBanner alert={alert} onClose={() => setAlert(null)} />

        {!currentUser && activeTab === 'register' && (
          <StudentRegisterView onRegistered={handleRegistered} />
        )}
        {!currentUser && activeTab !== 'register' && (
          <LoginView
            onLogin={handleLogin}
            onSwitchRegister={() => setActiveTab('register')}
          />
        )}

        {currentUser && currentUser.role === 'student' && (
          <>
            {activeTab === 'dashboard' && <StudentDashboardView token={token} />}
            {activeTab === 'profile' && <StudentProfileView token={token} />}
            {activeTab === 'internships' && <InternshipCatalogView token={token} />}
            {activeTab === 'applications' && <ApplicationTrackerView token={token} />}
            {activeTab === 'tests' && <AptitudeTestView token={token} />}
            {activeTab === 'history' && <TestHistoryView token={token} />}
          </>
        )}

        {currentUser && currentUser.role === 'recruiter' && (
          <RecruiterDashboardView activeTab={activeTab} token={token} />
        )}

        {currentUser && currentUser.role === 'admin' && (
          <AdminDashboardView activeTab={activeTab} token={token} />
        )}
      </main>

      <Footer />
    </div>
  );
}
