/**
 * Test Suite: Role-Based Access Control (RBAC) Verification
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Requirement Traceability: IPR-F-003, IPR-SR-003, TC-Auth-03
 */

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { authenticateToken, JWT_SECRET } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');

const app = express();
app.use(express.json());

// Protected dummy endpoints for testing RBAC
app.get('/api/student/profile', authenticateToken, authorizeRoles('student'), (req, res) => {
  res.json({ success: true, message: 'Student profile access granted', user: req.user });
});

app.post('/api/recruiter/post-internship', authenticateToken, authorizeRoles('recruiter'), (req, res) => {
  res.json({ success: true, message: 'Recruiter internship posting granted', user: req.user });
});

app.get('/api/admin/system-logs', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({ success: true, message: 'Admin system logs access granted', user: req.user });
});

app.get('/api/common/dashboard', authenticateToken, authorizeRoles('student', 'recruiter', 'admin'), (req, res) => {
  res.json({ success: true, message: 'Shared dashboard access granted', user: req.user });
});

describe('RBAC Verification Suite (TC-Auth-03 / IPR-F-003)', () => {
  const studentToken = jwt.sign({ id: 's1', role: 'student', email: 'student@pes.edu' }, JWT_SECRET);
  const recruiterToken = jwt.sign({ id: 'r1', role: 'recruiter', email: 'recruiter@company.com' }, JWT_SECRET);
  const adminToken = jwt.sign({ id: 'a1', role: 'admin', email: 'admin@pes.edu' }, JWT_SECRET);

  it('should allow student to access student-only endpoint', async () => {
    const res = await request(app)
      .get('/api/student/profile')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should FORBID student from accessing recruiter endpoint with 403 (TC-Auth-03)', async () => {
    const res = await request(app)
      .post('/api/recruiter/post-internship')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Forbidden');
  });

  it('should FORBID student from accessing admin endpoint with 403 (TC-Auth-03)', async () => {
    const res = await request(app)
      .get('/api/admin/system-logs')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow recruiter to access recruiter-only endpoint', async () => {
    const res = await request(app)
      .post('/api/recruiter/post-internship')
      .set('Authorization', `Bearer ${recruiterToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should FORBID recruiter from accessing admin endpoint with 403 (TC-Auth-03)', async () => {
    const res = await request(app)
      .get('/api/admin/system-logs')
      .set('Authorization', `Bearer ${recruiterToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow admin to access admin-only endpoint', async () => {
    const res = await request(app)
      .get('/api/admin/system-logs')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should allow all roles to access shared dashboard endpoint', async () => {
    for (const token of [studentToken, recruiterToken, adminToken]) {
      const res = await request(app)
        .get('/api/common/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }
  });
});
