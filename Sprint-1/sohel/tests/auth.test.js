/**
 * Test Suite: Authentication Verification
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Requirement Traceability: IPR-F-001, IPR-F-002, TC-Auth-01, TC-Auth-02
 */

const express = require('express');
const request = require('supertest');
const authRoutes = require('../routes/authRoutes');
const { inMemoryUsers } = require('../controllers/authController');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication Test Suite (TC-Auth-01, TC-Auth-02)', () => {
  beforeEach(() => {
    inMemoryUsers.clear();
  });

  describe('TC-Auth-01: User Registration', () => {
    it('should successfully register a student with valid details (IPR-F-001)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Sohel Chapparband',
          email: 'sohel.test@pes.edu',
          password: 'Password@123',
          role: 'student',
          department: 'Computer Science and Engineering'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('sohel.test@pes.edu');
      expect(res.body.user.role).toBe('student');
    });

    it('should reject registration when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'missingname@pes.edu',
          password: 'pass'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject registration with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid Email User',
          email: 'not-an-email',
          password: 'Password@123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should prevent duplicate user registration with same email (TC-Auth-01)', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'First User',
          email: 'duplicate@pes.edu',
          password: 'Password@123'
        });

      // Second registration with duplicate email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Second User',
          email: 'duplicate@pes.edu',
          password: 'Password@456'
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });
  });

  describe('TC-Auth-02: User Login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test User',
          email: 'login.test@pes.edu',
          password: 'SecurePassword123',
          role: 'student'
        });
    });

    it('should authenticate user with valid credentials and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login.test@pes.edu',
          password: 'SecurePassword123'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('login.test@pes.edu');
    });

    it('should reject login attempt with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login.test@pes.edu',
          password: 'WrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid email or password');
    });

    it('should reject login attempt with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@pes.edu',
          password: 'SecurePassword123'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
