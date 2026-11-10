/**
 * Frontend Structure & Validator Smoke Test
 * Author: NAVYA R (PES2UG24CS308)
 * Usage: node tests/uiSmokeTest.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');

const expectedFiles = [
  'public/index.html',
  'src/index.js',
  'src/App.jsx',
  'src/styles.css',
  'src/services/api.js',
  'src/services/authService.js',
  'src/services/internshipService.js',
  'src/services/testService.js',
  'src/utils/validators.js',
  'src/hooks/useAuth.js',
  'src/hooks/useDebounce.js',
  'src/hooks/useTimer.js',
  'src/components/common/AlertBanner.jsx',
  'src/components/common/StatusBadge.jsx',
  'src/components/common/LoadingSpinner.jsx',
  'src/components/layout/Navbar.jsx',
  'src/components/layout/Footer.jsx',
  'src/components/auth/LoginView.jsx',
  'src/components/auth/StudentRegisterView.jsx',
  'src/components/student/PreparationGauge.jsx',
  'src/components/student/PrepChecklist.jsx',
  'src/components/student/StudentDashboardView.jsx',
  'src/components/student/StudentProfileView.jsx',
  'src/components/student/InternshipFilterBar.jsx',
  'src/components/student/InternshipCatalogView.jsx',
  'src/components/student/ApplicationTrackerView.jsx',
  'src/components/student/AptitudeTestView.jsx',
  'src/components/student/TestHistoryView.jsx',
  'src/components/recruiter/PostInternshipForm.jsx',
  'src/components/recruiter/RecruiterDashboardView.jsx',
  'src/components/admin/UserManagementTable.jsx',
  'src/components/admin/AdminDashboardView.jsx'
];

let verified = 0;
for (const relPath of expectedFiles) {
  const fullPath = path.join(rootDir, relPath);
  assert.ok(fs.existsSync(fullPath), `Missing expected frontend file: ${relPath}`);
  verified++;
}

// Verify CSS breakpoints and key classes exist
const css = fs.readFileSync(path.join(rootDir, 'src/styles.css'), 'utf8');
assert.ok(css.includes('@media (max-width: 900px)'), 'Responsive 900px media query missing');
assert.ok(css.includes('@media (max-width: 640px)'), 'Mobile 640px media query missing');

console.log(`Frontend UI Smoke Test Passed: ${verified}/${expectedFiles.length} modular files verified.`);
