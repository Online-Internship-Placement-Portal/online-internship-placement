/**
 * MongoDB Database Connection Configuration
 * Author: Patnaikuni Sai Dheeraj (PES2UG24CS341)
 * Role: Database Setup
 * Traceability: SAD Section 3.6 & Section 3.7 (Data Stores & Availability)
 */

const mongoose = require('mongoose');

const connectDB = async (customUri) => {
  const uri = customUri || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/internship_placement_portal';

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // If running in development without a local MongoDB daemon, log warning
    console.warn('[MongoDB] Note: Ensure MongoDB is running on mongodb://127.0.0.1:27017 or set MONGO_URI in .env');
    return null;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed.');
  } catch (error) {
    console.error('[MongoDB] Error closing connection:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
