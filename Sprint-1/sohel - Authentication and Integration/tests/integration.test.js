/**
 * Test Suite: Security & End-to-End Integration Tests
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Requirement Traceability: IPR-SR-001, IPR-SR-005, TC-Sec-01, TC-Sec-05
 */

const express = require('express');
const request = require('supertest');
const authRoutes = require('../routes/authRoutes');
const { authenticateToken } = require('../middleware/authMiddleware');
const { sanitizeInput } = require('../middleware/sanitizeMiddleware');
const { inMemoryUsers } = require('../controllers/authController');

const app = express();
app.use(express.json());
app.use(sanitizeInput);
app.use('/api/auth', authRoutes);

app.get('/api/protected/resource', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Protected resource reached', user: req.user });
});

describe('Security & Integration Suite (TC-Sec-01, TC-Sec-05)', () => {
  beforeEach(() => {
    inMemoryUsers.clear();
  });

  describe('TC-Sec-01: Authentication Protection', () => {
    it('should reject access to protected resource when no token is supplied (401)', async () => {
      const res = await request(app).get('/api/protected/resource');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('No authorization token provided');
    });

    it('should reject access with malformed token (401)', async () => {
      const res = await request(app)
        .get('/api/protected/resource')
        .set('Authorization', 'InvalidTokenString');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject access with forged or expired JWT token (401)', async () => {
      const res = await request(app)
        .get('/api/protected/resource')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('TC-Sec-05: Input Sanitization (XSS Prevention)', () => {
    it('should sanitize script tags in registration name field', async () => {
      const maliciousPayload = {
        name: 'John <script>alert("XSS")</script>Doe',
        email: 'sanitized@pes.edu',
        password: 'Password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(maliciousPayload);

      expect(res.status).toBe(201);
      expect(res.body.user.name).not.toContain('<script>');
      expect(res.body.user.name).toBe('John Doe');
    });

    it('should sanitize inline event handlers such as onerror or javascript: URLs', async () => {
      const maliciousPayload = {
        name: '<img src=x onerror=alert(1)>Student Name',
        email: 'event@pes.edu',
        password: 'Password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(maliciousPayload);

      expect(res.status).toBe(201);
      expect(res.body.user.name).not.toContain('onerror');
      expect(res.body.user.name).not.toContain('<img');
    });
  });

  describe('End-to-End Registration -> Login -> Protected Resource Flow', () => {
    it('should complete the entire cycle successfully', async () => {
      // 1. Register student
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'End-to-End Student',
          email: 'e2e@pes.edu',
          password: 'Password@123',
          role: 'student'
        });
      expect(regRes.status).toBe(201);

      // 2. Login to receive JWT token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'e2e@pes.edu',
          password: 'Password@123'
        });
      expect(loginRes.status).toBe(200);
      const token = loginRes.body.token;
      expect(token).toBeDefined();

      // 3. Access protected resource with acquired token
      const protectedRes = await request(app)
        .get('/api/protected/resource')
        .set('Authorization', `Bearer ${token}`);
      expect(protectedRes.status).toBe(200);
      expect(protectedRes.body.user.email).toBe('e2e@pes.edu');

      // 4. Access /api/auth/me
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(meRes.status).toBe(200);
      expect(meRes.body.user.name).toBe('End-to-End Student');
    });
  });
});
