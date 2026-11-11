/**
 * Unit Test Suite — Covers All Branches of Middleware & Controllers
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Usage: node --test tests/unit.test.js
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');
const { sanitizeString, sanitizePayload, sanitizeInput } = require('../middleware/sanitizeMiddleware');
const { SlidingWindowRateLimiter } = require('../middleware/rateLimitMiddleware');
const { applySecurityHeaders } = require('../middleware/securityHeadersMiddleware');
const { getSystemHealth } = require('../controllers/healthController');
const { getMe } = require('../controllers/authController');

function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return {
        json: (data) => {
          this.body = data;
          return this;
        }
      };
    }
  };
}

test('authMiddleware handles missing, valid, raw, expired, and invalid tokens', () => {
  // 1. Missing token
  const resMissing = createMockRes();
  authenticateToken({ headers: {} }, resMissing, () => assert.fail('Should not call next'));
  assert.equal(resMissing.statusCode, 401);

  // 2. Valid Bearer token (lowercase header)
  const token = jwt.sign({ id: 'u1', role: 'student' }, JWT_SECRET, { expiresIn: '1h' });
  const reqBearer = { headers: { authorization: `Bearer ${token}` } };
  let calledBearer = false;
  authenticateToken(reqBearer, createMockRes(), () => { calledBearer = true; });
  assert.equal(calledBearer, true);
  assert.equal(reqBearer.user.id, 'u1');

  // 3. Raw token without Bearer prefix (capitalized Authorization header)
  const reqRaw = { headers: { Authorization: token } };
  let calledRaw = false;
  authenticateToken(reqRaw, createMockRes(), () => { calledRaw = true; });
  assert.equal(calledRaw, true);

  // 4. Expired token branch
  const expired = jwt.sign({ id: 'u1' }, JWT_SECRET, { expiresIn: -10 });
  const resExpired = createMockRes();
  authenticateToken({ headers: { authorization: `Bearer ${expired}` } }, resExpired, () => {});
  assert.equal(resExpired.statusCode, 401);
  assert.match(resExpired.body.message, /expired/i);

  // 5. Invalid signature branch
  const resInvalid = createMockRes();
  authenticateToken({ headers: { authorization: 'Bearer invalid.jwt.token' } }, resInvalid, () => {});
  assert.equal(resInvalid.statusCode, 401);
  assert.match(resInvalid.body.message, /invalid/i);
});

test('rbacMiddleware enforces role boundaries and unauthenticated checks', () => {
  const adminOnly = authorizeRoles('admin', 'recruiter');

  // 1. Missing req.user
  const resNoUser = createMockRes();
  adminOnly({}, resNoUser, () => {});
  assert.equal(resNoUser.statusCode, 401);

  // 2. Missing req.user.role
  const resNoRole = createMockRes();
  adminOnly({ user: { id: 'u1' } }, resNoRole, () => {});
  assert.equal(resNoRole.statusCode, 401);

  // 3. Forbidden role
  const resForbidden = createMockRes();
  adminOnly({ user: { role: 'student' } }, resForbidden, () => {});
  assert.equal(resForbidden.statusCode, 403);

  // 4. Allowed role (case-insensitive branch)
  let nextCalled = false;
  adminOnly({ user: { role: 'Admin' } }, createMockRes(), () => { nextCalled = true; });
  assert.equal(nextCalled, true);
});

test('sanitizeMiddleware cleans XSS across strings, objects, arrays, and middleware branches', () => {
  assert.equal(sanitizeString(123), 123);
  assert.equal(sanitizeString('<script>alert(1)</script>Hello'), 'Hello');
  assert.equal(sanitizeString('<iframe src="evil"></iframe>Safe'), 'Safe');
  assert.equal(sanitizeString('<img src=x onerror="bad()">Text'), 'Text');
  assert.equal(sanitizeString('<div onload=evil()>Box</div>'), 'Box');

  assert.equal(sanitizePayload(null), null);
  assert.equal(sanitizePayload(undefined), undefined);
  assert.equal(sanitizePayload(42), 42);
  assert.deepEqual(sanitizePayload(['<b>one</b>', 2]), ['one', 2]);
  assert.deepEqual(sanitizePayload({ a: '<script>x()</script>ok' }), { a: 'ok' });

  // Middleware with body/query/params present
  const reqFull = { body: { name: '<b>Sohel</b>' }, query: { q: '<script>x</script>hi' }, params: { id: '<i>1</i>' } };
  let nextFull = false;
  sanitizeInput(reqFull, {}, () => { nextFull = true; });
  assert.equal(nextFull, true);
  assert.equal(reqFull.body.name, 'Sohel');
  assert.equal(reqFull.query.q, 'hi');
  assert.equal(reqFull.params.id, '1');

  // Middleware with empty req
  let nextEmpty = false;
  sanitizeInput({}, {}, () => { nextEmpty = true; });
  assert.equal(nextEmpty, true);
});

test('rateLimitMiddleware allows valid bursts, blocks over limit, expires old timestamps, and resets', () => {
  const limiter = new SlidingWindowRateLimiter(1000, 2);
  const mw = limiter.middleware();

  const res1 = createMockRes();
  let pass1 = false;
  mw({ ip: '10.0.0.1' }, res1, () => { pass1 = true; });
  assert.equal(pass1, true);
  assert.equal(res1.headers['X-RateLimit-Remaining'], 1);

  const res2 = createMockRes();
  mw({ connection: { remoteAddress: '10.0.0.1' } }, res2, () => {});
  assert.equal(res2.headers['X-RateLimit-Remaining'], 0);

  // 3rd call hits 429 limit
  const res3 = createMockRes();
  mw({ ip: '10.0.0.1' }, res3, () => assert.fail('Should block 3rd call'));
  assert.equal(res3.statusCode, 429);
  assert.ok(res3.headers['Retry-After'] >= 1);

  // Fallback IP branch + reset branch
  limiter.reset();
  const resFallback = createMockRes();
  let passAfterReset = false;
  mw({}, resFallback, () => { passAfterReset = true; });
  assert.equal(passAfterReset, true);
});

test('securityHeadersMiddleware applies OWASP headers and auth no-cache branch', () => {
  const resPublic = createMockRes();
  let nextPublic = false;
  applySecurityHeaders({ path: '/api/internships' }, resPublic, () => { nextPublic = true; });
  assert.equal(nextPublic, true);
  assert.equal(resPublic.headers['X-Frame-Options'], 'DENY');
  assert.equal(resPublic.headers['Cache-Control'], undefined);

  const resAuth = createMockRes();
  applySecurityHeaders({ path: '/api/auth/login' }, resAuth, () => {});
  assert.match(resAuth.headers['Cache-Control'], /no-store/);

  const resProfile = createMockRes();
  applySecurityHeaders({ path: '/api/profile/me' }, resProfile, () => {});
  assert.equal(resProfile.headers['Pragma'], 'no-cache');
});

test('healthController and authController getMe cover success and missing user branches', async () => {
  const resHealth = createMockRes();
  getSystemHealth({}, resHealth);
  assert.equal(resHealth.statusCode, 200);
  assert.equal(resHealth.body.data.status, 'UP');

  const resNoUser = createMockRes();
  await getMe({}, resNoUser);
  assert.equal(resNoUser.statusCode, 401);

  const resOk = createMockRes();
  await getMe({ user: { email: 'sohel@pes.edu' } }, resOk);
  assert.equal(resOk.statusCode, 200);
  assert.equal(resOk.body.user.email, 'sohel@pes.edu');
});
