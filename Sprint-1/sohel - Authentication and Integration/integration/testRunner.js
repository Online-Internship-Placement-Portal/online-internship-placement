/**
 * Standalone Automated Test Runner for Authentication & Integration
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Traceability: STP Section 13.1 & 14 (Test Metrics & Reporting)
 * 
 * Usage: node integration/testRunner.js
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');
const { sanitizeString, sanitizePayload } = require('../middleware/sanitizeMiddleware');
const { inMemoryUsers, register, login } = require('../controllers/authController');

let testsPassed = 0;
let testsFailed = 0;
const results = [];

function assert(condition, message, testCaseId, reqId) {
  if (condition) {
    testsPassed++;
    results.push({ id: testCaseId, req: reqId, status: 'PASS', description: message });
    console.log(`  [PASS] ${testCaseId} (${reqId}): ${message}`);
  } else {
    testsFailed++;
    results.push({ id: testCaseId, req: reqId, status: 'FAIL', description: message });
    console.error(`  [FAIL] ${testCaseId} (${reqId}): ${message}`);
  }
}

async function runAllTests() {
  console.log('================================================================');
  console.log(' ONLINE INTERNSHIP & PLACEMENT PORTAL - SPRINT 1 TEST SUITE');
  console.log(' Module: Authentication & Integration');
  console.log(' Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)');
  console.log('================================================================\n');

  // Test 1: Password Hashing (IPR-SR-002)
  console.log('-> Running IPR-SR-002: Salted Adaptive Password Hashing Tests');
  const rawPass = 'SecretPassword123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(rawPass, salt);
  assert(hash !== rawPass, 'Password is never stored in plaintext', 'TC-Sec-02', 'IPR-SR-002');
  assert(await bcrypt.compare(rawPass, hash), 'Bcrypt validates valid password against hash', 'TC-Sec-02', 'IPR-SR-002');
  assert(!(await bcrypt.compare('WrongPassword', hash)), 'Bcrypt rejects mismatched password', 'TC-Sec-02', 'IPR-SR-002');

  // Test 2: Input Sanitization (IPR-SR-005, TC-Sec-05)
  console.log('\n-> Running IPR-SR-005: Input Sanitization & XSS Prevention Tests');
  const xssInput = 'Student<script>alert(1)</script> Name';
  const cleanStr = sanitizeString(xssInput);
  assert(cleanStr === 'Student Name', 'Script tags are cleanly stripped from user input', 'TC-Sec-05', 'IPR-SR-005');
  const payload = {
    title: '<img src=x onerror=alert("hacked")> Software Engineer',
    skills: ['<script>evil()</script>React', 'Node.js']
  };
  const sanitized = sanitizePayload(payload);
  assert(sanitized.title === 'Software Engineer', 'Event handler injection stripped from object', 'TC-Sec-05', 'IPR-SR-005');
  assert(sanitized.skills[0] === 'React', 'Nested array input properly sanitized', 'TC-Sec-05', 'IPR-SR-005');

  // Test 3: JWT Token Generation & Verification (IPR-SR-001, TC-Sec-01)
  console.log('\n-> Running IPR-SR-001: JWT Authentication Token Verification');
  const token = jwt.sign({ id: 'user_101', email: 'sohel@pes.edu', role: 'student' }, JWT_SECRET, { expiresIn: '1h' });
  assert(typeof token === 'string' && token.split('.').length === 3, 'JWT token has valid 3-part format', 'TC-Sec-01', 'IPR-SR-001');
  const decoded = jwt.verify(token, JWT_SECRET);
  assert(decoded.email === 'sohel@pes.edu' && decoded.role === 'student', 'Token decodes user id, email, and role', 'TC-Sec-01', 'IPR-SR-001');

  // Test 4: RBAC Role Authorization (IPR-F-003, TC-Auth-03)
  console.log('\n-> Running IPR-F-003: Role-Based Access Control (RBAC) Tests');
  const rbacStudentMiddleware = authorizeRoles('student');
  const rbacRecruiterMiddleware = authorizeRoles('recruiter');
  const rbacAdminMiddleware = authorizeRoles('admin');

  // Mock student request
  let studentForbidden = false;
  const mockStudentReq = { user: { role: 'student' } };
  const mockRes = {
    status: (code) => ({
      json: (data) => {
        if (code === 403) studentForbidden = true;
      }
    })
  };

  rbacAdminMiddleware(mockStudentReq, mockRes, () => {});
  assert(studentForbidden, 'Student cannot access admin-protected endpoint (403)', 'TC-Auth-03', 'IPR-F-003');

  let recruiterAllowed = false;
  const mockRecruiterReq = { user: { role: 'recruiter' } };
  rbacRecruiterMiddleware(mockRecruiterReq, mockRes, () => { recruiterAllowed = true; });
  assert(recruiterAllowed, 'Recruiter permitted to access recruiter endpoint', 'TC-Auth-03', 'IPR-F-003');

  // Test 5: Registration & Login Flow (IPR-F-001, IPR-F-002, TC-Auth-01, TC-Auth-02)
  console.log('\n-> Running IPR-F-001 & IPR-F-002: Registration & Login Endpoints');
  inMemoryUsers.clear();

  let regStatusCode = 0;
  let regResponse = {};
  const mockRegReq = {
    body: {
      name: 'Sohel PES',
      email: 'sohel.chapparband@pes.edu',
      password: 'StrongPassword2026',
      role: 'student',
      department: 'CSE'
    }
  };
  const mockRegRes = {
    status: (code) => {
      regStatusCode = code;
      return {
        json: (data) => { regResponse = data; }
      };
    }
  };

  await register(mockRegReq, mockRegRes);
  assert(regStatusCode === 201 && regResponse.success === true, 'Student registration creates account with 201', 'TC-Auth-01', 'IPR-F-001');

  // Test duplicate registration
  let dupStatusCode = 0;
  const mockDupRes = {
    status: (code) => {
      dupStatusCode = code;
      return { json: () => {} };
    }
  };
  await register(mockRegReq, mockDupRes);
  assert(dupStatusCode === 409, 'Duplicate email registration rejected with 409 Conflict', 'TC-Auth-01', 'IPR-F-001');

  // Test login with valid credentials
  let loginStatusCode = 0;
  let loginResponse = {};
  const mockLoginReq = {
    body: {
      email: 'sohel.chapparband@pes.edu',
      password: 'StrongPassword2026'
    }
  };
  const mockLoginRes = {
    status: (code) => {
      loginStatusCode = code;
      return {
        json: (data) => { loginResponse = data; }
      };
    }
  };
  await login(mockLoginReq, mockLoginRes);
  assert(loginStatusCode === 200 && !!loginResponse.token, 'Login returns 200 and valid JWT token', 'TC-Auth-02', 'IPR-F-002');

  // Test login with invalid credentials
  let invalidLoginCode = 0;
  const mockBadLoginReq = {
    body: {
      email: 'sohel.chapparband@pes.edu',
      password: 'WrongPassword'
    }
  };
  const mockBadLoginRes = {
    status: (code) => {
      invalidLoginCode = code;
      return { json: () => {} };
    }
  };
  await login(mockBadLoginReq, mockBadLoginRes);
  assert(invalidLoginCode === 401, 'Login with incorrect password rejected with 401', 'TC-Auth-02', 'IPR-F-002');

  // Summary Metrics (STP Section 14)
  console.log('\n================================================================');
  console.log(' SPRINT 1 TEST EXECUTION SUMMARY (STP Section 14)');
  console.log('================================================================');
  console.log(` Total Test Cases Executed: ${testsPassed + testsFailed}`);
  console.log(` Passed: ${testsPassed}`);
  console.log(` Failed: ${testsFailed}`);
  console.log(` Pass Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  console.log('================================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runAllTests().catch((err) => {
    console.error('Test execution failed:', err);
    process.exit(1);
  });
}

module.exports = { runAllTests };
