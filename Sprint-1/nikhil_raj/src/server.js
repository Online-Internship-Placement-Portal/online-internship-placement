/**
 * Backend Server Entrypoint
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: SRS Section 2.4 Server Side (Node.js/Express)
 */

const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('../../dheeraj/config/db');

const startServer = async () => {
  // Attempt DB connection
  await connectDB(env.MONGO_URI);

  const server = app.listen(env.PORT, () => {
    console.log('================================================================');
    console.log('  ONLINE INTERNSHIP & PLACEMENT PREPARATION PORTAL');
    console.log(`  Backend Server running on http://localhost:${env.PORT}`);
    console.log(`  Environment: ${env.NODE_ENV}`);
    console.log(`  Health Check: http://localhost:${env.PORT}/api/health`);
    console.log('================================================================');
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\n[Server] Graceful shutdown requested. Closing HTTP server...');
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
