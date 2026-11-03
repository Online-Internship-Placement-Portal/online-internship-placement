/**
 * Environment Configuration
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: SRS Section 2.4, SAD Section 3.6
 */

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/internship_placement_portal',
  JWT_SECRET: process.env.JWT_SECRET || 'portal_jwt_secret_key_development_pes_2026',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
};
