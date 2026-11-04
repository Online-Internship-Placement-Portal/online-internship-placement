/**
 * Backend Configuration & Environment Variables (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: SAD Section 3.6, IPR-NF-007
 */

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/internship_placement_portal',
  JWT_SECRET: process.env.JWT_SECRET || 'pes_placement_jwt_secret_key_sprint2_2026',
  JWT_EXPIRES_IN: '24h',
  CORS_ORIGIN: '*'
};
