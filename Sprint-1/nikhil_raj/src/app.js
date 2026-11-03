/**
 * Express Application Configuration
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: SAD Section 3.3, 3.4, 4.1
 */

const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

let authRoutes;
try {
  authRoutes = require('../../sohel - Authentication and Integration/routes/authRoutes');
} catch (e) {
  try {
    authRoutes = require('../../sohel/routes/authRoutes');
  } catch (e2) {
    authRoutes = express.Router();
  }
}

const internshipRoutesModule = require('./routes/internshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const testRoutes = require('./routes/testRoutes');
const progressRoutes = require('./routes/progressRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'Online Internship & Placement Preparation Portal Backend',
    version: '1.0.0 (Sprint 1)'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutesModule.router);
app.use('/api/applications', applicationRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on this server.`
  });
});

app.use(errorHandler);

module.exports = app;
