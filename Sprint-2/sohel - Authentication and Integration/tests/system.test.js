/**
 * End-to-End System Test Suite (HTTP Server, Auth, RBAC, Sanitization & Health)
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Usage: node --test tests/system.test.js
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');

const authRoutes = require('../routes/authRoutes');
const { applySecurityHeaders } = require('../middleware/securityHeadersMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');
const { inMemoryUsers } = require('../controllers/authController');

let server;
let baseUrl;

test.before(async () => {
  const app = express();
  app.use(express.json());
  app.use(applySecurityHeaders);
  app.use('/api/auth', authRoutes);

  // Protected admin-only test route for full RBAC system verification
  app.get('/api/admin/audit', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.status(200).json({ success: true, user: req.user.email });
  });

  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

test.beforeEach(() => {
  authLimiter.reset();
});

test('System Registration Flow: validation branches, XSS strip, 201 creation & 409 duplicate', async () => {
  const email = 'system.student@pes.edu';
  inMemoryUsers.delete(email);

  // 1. Missing required fields -> 400
  const missingRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  assert.equal(missingRes.status, 400);

  // 2. Invalid email format -> 400
  const badEmailRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: 'not-an-email', password: 'Password123' })
  });
  assert.equal(badEmailRes.status, 400);

  // 3. Short password -> 400
  const shortPassRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email, password: '123' })
  });
  assert.equal(shortPassRes.status, 400);

  // 4. Invalid role -> 400
  const badRoleRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email, password: 'Password123', role: 'superhacker' })
  });
  assert.equal(badRoleRes.status, 400);

  // 5. Valid registration with XSS attempt in name -> 201 & sanitized
  const validRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: '<script>alert(1)</script>System Student',
      email,
      password: 'Password123',
      role: 'student'
    })
  });
  const validBody = await validRes.json();
  assert.equal(validRes.status, 201);
  assert.equal(validBody.user.name, 'System Student');
  assert.ok(validBody.token);

  // 6. Duplicate email -> 409 Conflict
  const dupRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Dup', email, password: 'Password123' })
  });
  assert.equal(dupRes.status, 409);
});

test('System Login, Profile Identity (/me), Security Headers & RBAC Flow', async () => {
  // 1. Missing credentials -> 400
  const emptyRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sohel@pes.edu' })
  });
  assert.equal(emptyRes.status, 400);

  // 2. Non-existent user -> 401
  const unknownRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nobody@pes.edu', password: 'Password123' })
  });
  assert.equal(unknownRes.status, 401);

  // 3. Wrong password -> 401
  const wrongPassRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sohel@pes.edu', password: 'WrongPassword' })
  });
  assert.equal(wrongPassRes.status, 401);

  // 4. Valid student login -> 200 + JWT
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sohel@pes.edu', password: 'Password123' })
  });
  const loginBody = await loginRes.json();
  assert.equal(loginRes.status, 200);
  assert.equal(loginRes.headers.get('x-frame-options'), 'DENY');
  const studentToken = loginBody.token;

  // 5. Protected /api/auth/me without token -> 401
  const meNoAuth = await fetch(`${baseUrl}/api/auth/me`);
  assert.equal(meNoAuth.status, 401);

  // 6. Protected /api/auth/me with student token -> 200
  const meOk = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const meBody = await meOk.json();
  assert.equal(meOk.status, 200);
  assert.equal(meBody.user.email, 'sohel@pes.edu');

  // 7. RBAC: Student accessing admin endpoint -> 403 Forbidden
  const adminBlocked = await fetch(`${baseUrl}/api/admin/audit`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  assert.equal(adminBlocked.status, 403);

  // 8. Admin login & RBAC allowed -> 200
  const adminLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@pes.edu', password: 'AdminPass123' })
  });
  const adminBody = await adminLogin.json();
  const adminAllowed = await fetch(`${baseUrl}/api/admin/audit`, {
    headers: { Authorization: `Bearer ${adminBody.token}` }
  });
  assert.equal(adminAllowed.status, 200);
});

test('System Health Check Endpoint returns operational telemetry', async () => {
  const healthRes = await fetch(`${baseUrl}/api/auth/health`);
  const healthBody = await healthRes.json();
  assert.equal(healthRes.status, 200);
  assert.equal(healthBody.success, true);
  assert.equal(healthBody.data.status, 'UP');
  assert.ok(healthBody.data.processMemory.heapUsedMB > 0);
});
