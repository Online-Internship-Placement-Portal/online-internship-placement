/**
 * Automated Verification: JWT Token Lifecycle, Expiration & Tampering Detection
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Traceability: IPR-SR-001, TC-Sec-01, TC-Sec-06
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET, authenticateToken } = require('../middleware/authMiddleware');

function runLifecycleTests() {
  console.log('--- Running Token Lifecycle & Security Integrity Test Suite ---');
  let passed = 0;
  let failed = 0;

  function check(cond, desc, id) {
    if (cond) {
      passed++;
      console.log(`  [PASS] ${id}: ${desc}`);
    } else {
      failed++;
      console.error(`  [FAIL] ${id}: ${desc}`);
    }
  }

  // 1. Valid Token Verification
  const validToken = jwt.sign(
    { id: 'usr_student_01', email: 'sohel@pes.edu', role: 'student' },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
  const decoded = jwt.verify(validToken, JWT_SECRET);
  check(decoded.email === 'sohel@pes.edu', 'Valid token verifies payload correctly', 'TC-Token-01');

  // 2. Expired Token Handling
  const expiredToken = jwt.sign(
    { id: 'usr_student_01', email: 'sohel@pes.edu', role: 'student' },
    JWT_SECRET,
    { expiresIn: -10 } // Expired 10 seconds ago
  );

  let expiredCaught = false;
  try {
    jwt.verify(expiredToken, JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') expiredCaught = true;
  }
  check(expiredCaught, 'TokenExpiredError thrown when token exceeds expiration duration', 'TC-Token-02');

  // 3. Signature Tampering Detection (Wrong secret)
  const tamperedToken = jwt.sign(
    { id: 'usr_student_01', email: 'sohel@pes.edu', role: 'admin' },
    'malicious_attacker_fake_secret'
  );

  let tamperingDetected = false;
  try {
    jwt.verify(tamperedToken, JWT_SECRET);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') tamperingDetected = true;
  }
  check(tamperingDetected, 'Cryptographic signature mismatch blocks tampered tokens', 'TC-Token-03');

  // 4. Bearer Parsing & Header Extraction
  let extractedUser = null;
  const mockReq = {
    headers: { authorization: `Bearer ${validToken}` }
  };
  const mockRes = {
    status: (c) => ({ json: (d) => {} })
  };
  authenticateToken(mockReq, mockRes, () => {
    extractedUser = mockReq.user;
  });
  check(extractedUser && extractedUser.role === 'student', 'Middleware extracts and attaches identity from Bearer header', 'TC-Token-04');

  // 5. Missing Authorization Header Rejection
  let rejectedStatus = 0;
  const mockEmptyReq = { headers: {} };
  const mockRejectRes = {
    status: (c) => {
      rejectedStatus = c;
      return { json: () => {} };
    }
  };
  authenticateToken(mockEmptyReq, mockRejectRes, () => {});
  check(rejectedStatus === 401, 'Requests without Bearer authorization header rejected with 401 Unauthorized', 'TC-Token-05');

  console.log(`\nLifecycle Results: ${passed} Passed, ${failed} Failed\n`);
  return { passed, failed };
}

if (require.main === module) {
  const { failed } = runLifecycleTests();
  if (failed > 0) process.exit(1);
}

module.exports = { runLifecycleTests };
