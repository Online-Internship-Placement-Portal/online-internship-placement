/**
 * Database Seeder Script
 * Author: Patnaikuni Sai Dheeraj (PES2UG24CS341)
 * Role: Database Setup
 * Traceability: STP Section 6 (Test Environment & Dummy Data)
 * 
 * Usage: node seed/seed.js
 */

const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const AptitudeTest = require('../models/AptitudeTest');
const PreparationProgress = require('../models/PreparationProgress');
const seedData = require('./seedData.json');

async function seedDatabase() {
  console.log('[Seeder] Connecting to MongoDB...');
  const conn = await connectDB();
  if (!conn) {
    console.log('[Seeder] Could not connect to MongoDB. Please ensure MongoDB service is active.');
    return;
  }

  try {
    console.log('[Seeder] Clearing old collections...');
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Internship.deleteMany({});
    await Application.deleteMany({});
    await AptitudeTest.deleteMany({});
    await PreparationProgress.deleteMany({});

    console.log('[Seeder] Seeding Users with bcrypt hashed passwords...');
    const createdUsers = [];
    for (const userData of seedData.users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      createdUsers.push(user);
    }

    const studentUser = createdUsers.find(u => u.role === 'student');
    const recruiterUser = createdUsers.find(u => u.role === 'recruiter');

    console.log('[Seeder] Seeding Student Profile...');
    await StudentProfile.create({
      student: studentUser._id,
      usn: 'PES2UG25CS826',
      cgpa: 8.92,
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Data Structures', 'Git'],
      resumeUrl: 'https://storage.portal.pes.edu/resumes/PES2UG25CS826.pdf',
      semester: 5,
      bio: 'Pre-final year CSE student passionate about full-stack engineering and distributed systems.'
    });

    console.log('[Seeder] Seeding Internships...');
    const createdInternships = [];
    for (const intern of seedData.internships) {
      const doc = await Internship.create({
        ...intern,
        postedBy: recruiterUser._id
      });
      createdInternships.push(doc);
    }

    console.log('[Seeder] Seeding Sample Student Application...');
    await Application.create({
      student: studentUser._id,
      internship: createdInternships[0]._id,
      status: 'Submitted',
      resume: 'https://storage.portal.pes.edu/resumes/PES2UG25CS826.pdf',
      coverNote: 'Excited to apply for Google SWE internship.'
    });

    console.log('[Seeder] Seeding Aptitude Tests...');
    for (const test of seedData.aptitudeTests) {
      await AptitudeTest.create(test);
    }

    console.log('[Seeder] Seeding Placement Preparation Progress...');
    await PreparationProgress.create([
      { student: studentUser._id, topic: 'Binary Search & Two Pointers', category: 'Algorithms', completed: true, score: 90 },
      { student: studentUser._id, topic: 'Dynamic Programming', category: 'Algorithms', completed: false, score: 65 },
      { student: studentUser._id, topic: 'Database Normalization & Indexing', category: 'Core CS Concepts', completed: true, score: 85 },
      { student: studentUser._id, topic: 'Time & Work Problems', category: 'Aptitude', completed: true, score: 95 }
    ]);

    console.log('\n[Seeder] SUCCESS! Database seeded with standard STP test data.');
    console.log('------------------------------------------------------------');
    console.log('Sample Credentials for Demo:');
    console.log('  Student:   sohel@pes.edu          / Password123');
    console.log('  Recruiter: recruiter@google.com   / RecruiterPass123');
    console.log('  Admin:     admin@pes.edu          / AdminPass123');
    console.log('------------------------------------------------------------\n');
  } catch (err) {
    console.error('[Seeder] Error during database seeding:', err);
  } finally {
    await disconnectDB();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
