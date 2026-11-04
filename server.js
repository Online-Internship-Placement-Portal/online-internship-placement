/**
 * Integrated Portal Server (Sprint-1 Working Product)
 * Online Internship & Placement Preparation Portal
 * Course: UE24CS341A - Software Engineering, PES University
 * 
 * Integrates:
 * - Sohel: Authentication & Integration
 * - Nikhil Raj: Backend Setup & REST APIs
 * - Dheeraj: Database Setup & Models
 * - Navya: User Interface (Frontend)
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

// Import member modules
let connectDB;
try {
  connectDB = require('./Sprint-1/dheeraj/config/db').connectDB;
} catch (e) {
  try {
    connectDB = require('./Sprint-1/Dheeraj/config/db').connectDB;
  } catch (e2) {
    connectDB = async () => {};
  }
}
let authRoutes;
try {
  authRoutes = require('./Sprint-1/sohel - Authentication and Integration/routes/authRoutes');
} catch (e) {
  try {
    authRoutes = require('./Sprint-1/sohel/routes/authRoutes');
  } catch (e2) {
    authRoutes = require('./Sprint-1/Sohel - Authentication and Integration/routes/authRoutes');
  }
}
let internshipRoutesModule;
try {
  internshipRoutesModule = require('./Sprint-1/nikhil_raj/src/routes/internshipRoutes');
} catch (e) {
  internshipRoutesModule = { router: express.Router() };
}
let applicationRoutes;
try {
  applicationRoutes = require('./Sprint-1/nikhil_raj/src/routes/applicationRoutes');
} catch (e) {
  applicationRoutes = express.Router();
}
let testRoutes;
try {
  testRoutes = require('./Sprint-1/nikhil_raj/src/routes/testRoutes');
} catch (e) {
  testRoutes = express.Router();
}
let progressRoutes;
try {
  progressRoutes = require('./Sprint-1/nikhil_raj/src/routes/progressRoutes');
} catch (e) {
  progressRoutes = express.Router();
}
let adminRoutes;
try {
  adminRoutes = require('./Sprint-1/nikhil_raj/src/routes/adminRoutes');
} catch (e) {
  adminRoutes = express.Router();
}
let errorHandler;
try {
  errorHandler = require('./Sprint-1/nikhil_raj/src/middleware/errorHandler');
} catch (e) {
  errorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  };
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB if available
if (typeof connectDB === 'function') {
  connectDB().then(async (conn) => {
    if (conn) {
      try {
        let User;
        try {
          User = require('./Sprint-1/dheeraj/models/User');
          require('./Sprint-1/dheeraj/models/StudentProfile');
          require('./Sprint-1/dheeraj/models/Internship');
          require('./Sprint-1/dheeraj/models/Application');
          require('./Sprint-1/dheeraj/models/AptitudeTest');
          require('./Sprint-1/dheeraj/models/PreparationProgress');
        } catch (mErr) {
          User = require('./Sprint-1/Dheeraj/models/User');
          require('./Sprint-1/Dheeraj/models/StudentProfile');
          require('./Sprint-1/Dheeraj/models/Internship');
          require('./Sprint-1/Dheeraj/models/Application');
          require('./Sprint-1/Dheeraj/models/AptitudeTest');
          require('./Sprint-1/Dheeraj/models/PreparationProgress');
        }

        const count = await User.countDocuments();
        if (count === 0) {
          console.log('[MongoDB] Empty database detected. Auto-seeding initial collections...');
          let seeder;
          try {
            seeder = require('./Sprint-1/dheeraj/seed/seed');
          } catch (sErr) {
            try {
              seeder = require('./Sprint-1/Dheeraj/seed/seed');
            } catch (sErr2) {}
          }
          if (seeder && seeder.seedDatabase) {
            await seeder.seedDatabase();
            console.log('[MongoDB] All collections created and populated successfully!');
          }
        }
      } catch (err) {
        console.warn('[MongoDB] Initialization notice:', err.message);
      }
    }
  }).catch(() => {});
}

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Online Internship & Placement Preparation Portal Backend is Operational',
    sprint: 'Sprint-1',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutesModule.router);
app.use('/api/applications', applicationRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all route to serve integrated single-page frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Centralized error handler
app.use(errorHandler);

const listenOnPort = (portToTry) => {
  const srv = app.listen(portToTry, () => {
    console.log('================================================================');
    console.log('  ONLINE INTERNSHIP & PLACEMENT PREPARATION PORTAL (SPRINT-1)');
    console.log(`  Working Product URL: http://localhost:${portToTry}`);
    console.log(`  Health Check:        http://localhost:${portToTry}/api/health`);
    console.log('================================================================');
  });

  srv.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Port ${portToTry} is already in use, trying http://localhost:${portToTry + 1}...]`);
      listenOnPort(portToTry + 1);
    } else {
      console.error(err);
    }
  });

  return srv;
};

const server = listenOnPort(PORT);

module.exports = server;
