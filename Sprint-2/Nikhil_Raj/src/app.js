/**
 * Express Application Assembly (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: SAD Section 3.3, 3.4 & 4.1
 */

const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const profileRoutes = require('./routes/profileRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const testRoutes = require('./routes/testRoutes');
const progressRoutes = require('./routes/progressRoutes');
const adminRoutes = require('./routes/adminRoutes');

let authRoutes;
try {
  authRoutes = require('../sohel - Authentication and Integration/routes/authRoutes');
} catch (e) {
  try {
    authRoutes = require('../../sohel - Authentication and Integration/routes/authRoutes');
  } catch (e2) {
    authRoutes = express.Router();
  }
}

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    sprint: 'Sprint-2',
    timestamp: new Date().toISOString(),
    message: 'Online Internship & Placement Preparation Portal Backend is Operational.'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
