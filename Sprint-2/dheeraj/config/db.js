/**
 * MongoDB Database Connection Configuration (Sprint-2)
 * Author: Patnaikuni Sai Dheeraj (PES2UG24CS341)
 * Role: Database Setup
 * Traceability: SAD Section 3.6 & Section 3.7 (Data Stores & Availability)
 */

const mongoose = require('mongoose');

const connectDB = async (customUri) => {
  const uri = customUri || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/internship_placement_portal';
  const timeoutValue = Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS);
  const serverSelectionTimeoutMS = Number.isFinite(timeoutValue) && timeoutValue > 0
    ? timeoutValue
    : 5000;

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS
    });
    console.log(`[MongoDB] Connected successfully to Sprint-2 database: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Notice: Running with dual-mode storage fallback (${error.message})`);
    console.warn('[MongoDB] Note: Ensure MongoDB is running on mongodb://127.0.0.1:27017 or set MONGO_URI in .env');
    return null;
  }
};

const disconnectDB = async () => {
  try {
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('[MongoDB] Connection closed.');
    }
  } catch (error) {
    console.error('[MongoDB] Error closing connection:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
