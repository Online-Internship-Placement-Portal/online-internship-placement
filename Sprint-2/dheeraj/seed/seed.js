/**
 * Database Seeder Script (Sprint-2)
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
const TestResult = require('../models/TestResult');
const PreparationProgress = require('../models/PreparationProgress');
const AuditLog = require('../models/AuditLog');
const seedData = require('./seedData.json');

async function seedDatabase() {
  console.log('[Sprint-2 Seeder] Connecting to MongoDB...');
  const conn = await connectDB();
  if (!conn) {
    console.log('[Sprint-2 Seeder] Could not connect to MongoDB. In-memory data store will be used for execution.');
    return;
  }

  try {
    console.log('[Sprint-2 Seeder] Cleaning existing collections...');
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Internship.deleteMany({});
    await Application.deleteMany({});
    await AptitudeTest.deleteMany({});
    await TestResult.deleteMany({});
    await PreparationProgress.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('[Sprint-2 Seeder] Seeding Users with bcrypt hashed passwords...');
    const userMap = new Map();
    for (const userData of seedData.users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      userMap.set(user.email, user);
    }

    const sohelStudent = userMap.get('sohel@pes.edu');
    const navyaStudent = userMap.get('navya@pes.edu');
    const googleRecruiter = userMap.get('recruiter@google.com');
    const adminUser = userMap.get('admin@pes.edu');

    console.log('[Sprint-2 Seeder] Seeding Student Profiles...');
    for (const prof of seedData.studentProfiles) {
      const studentUser = userMap.get(prof.email);
      if (studentUser) {
        await StudentProfile.create({
          student: studentUser._id,
          usn: prof.usn,
          cgpa: prof.cgpa,
          semester: prof.semester,
          department: prof.department,
          skills: prof.skills,
          resumeUrl: prof.resumeUrl,
          githubUrl: prof.githubUrl,
          linkedinUrl: prof.linkedinUrl,
          portfolioUrl: prof.portfolioUrl,
          bio: prof.bio,
          placementStatus: prof.placementStatus
        });
      }
    }

    console.log('[Sprint-2 Seeder] Seeding Internships...');
    const createdInternships = [];
    for (const intern of seedData.internships) {
      const doc = await Internship.create({
        ...intern,
        postedBy: googleRecruiter._id
      });
      createdInternships.push(doc);
    }

    console.log('[Sprint-2 Seeder] Seeding Applications with status pipeline...');
    // 1. Google application by Sohel - Interview Scheduled
    const app1 = await Application.create({
      student: sohelStudent._id,
      internship: createdInternships[0]._id,
      status: 'Interview Scheduled',
      appliedDate: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      resume: 'https://storage.portal.pes.edu/resumes/PES2UG25CS826_Resume.pdf',
      coverNote: 'Pre-final year CSE student experienced in distributed systems and systems programming.',
      recruiterFeedback: 'Strong algorithmic skills and solid academic record. Shortlisted for Round 1 technical interview.',
      interviewDetails: {
        scheduledDate: new Date(Date.now() + 4 * 24 * 3600 * 1000),
        meetingLink: 'https://meet.google.com/pes-sde-round1',
        round: 'Round 1: Data Structures & System Coding'
      }
    });

    // 2. Microsoft application by Navya - Shortlisted
    await Application.create({
      student: navyaStudent._id,
      internship: createdInternships[1]._id,
      status: 'Shortlisted',
      appliedDate: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      resume: 'https://storage.portal.pes.edu/resumes/PES2UG24CS308_Resume.pdf',
      coverNote: 'Passionate about building responsive, high-performance web experiences with React and TypeScript.',
      recruiterFeedback: 'Outstanding frontend portfolio and strong React background.'
    });

    console.log('[Sprint-2 Seeder] Seeding Aptitude Tests with Questions & Explanations...');
    const createdTests = [];
    for (const test of seedData.aptitudeTests) {
      const doc = await AptitudeTest.create(test);
      createdTests.push(doc);
    }

    console.log('[Sprint-2 Seeder] Seeding Test Results & Score History...');
    await TestResult.create({
      student: sohelStudent._id,
      test: createdTests[0]._id,
      score: 5,
      totalMarks: 5,
      percentage: 100,
      passed: true,
      durationTakenSeconds: 720,
      answers: createdTests[0].questions.map(q => ({
        questionId: q._id ? q._id.toString() : 'q',
        questionText: q.questionText,
        selectedOption: q.correctOption,
        correctOption: q.correctOption,
        isCorrect: true,
        explanation: q.explanation
      })),
      submittedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000)
    });

    console.log('[Sprint-2 Seeder] Seeding Placement Preparation Progress & Analytics...');
    for (const topicData of seedData.preparationTopics) {
      await PreparationProgress.create({
        student: sohelStudent._id,
        topic: topicData.topic,
        category: topicData.category,
        completed: topicData.completed,
        score: topicData.score
      });
    }

    console.log('[Sprint-2 Seeder] Seeding Audit Logs...');
    await AuditLog.create([
      {
        action: 'USER_REGISTERED',
        performedBy: sohelStudent._id,
        targetEntity: 'User',
        targetId: sohelStudent._id.toString(),
        details: { email: sohelStudent.email, role: 'student' }
      },
      {
        action: 'INTERNSHIP_CREATED',
        performedBy: googleRecruiter._id,
        targetEntity: 'Internship',
        targetId: createdInternships[0]._id.toString(),
        details: { company: 'Google', title: 'Software Development Engineer Intern' }
      },
      {
        action: 'APPLICATION_STATUS_UPDATED',
        performedBy: googleRecruiter._id,
        targetEntity: 'Application',
        targetId: app1._id.toString(),
        details: { newStatus: 'Interview Scheduled' }
      }
    ]);

    console.log('\n============================================================');
    console.log(' [Sprint-2 Seeder] SUCCESS! Sprint-2 Database Seeded');
    console.log(' All 8 Collections Populated with Standard STP Test Data');
    console.log('============================================================\n');
  } catch (err) {
    console.error('[Sprint-2 Seeder] Error during seeding:', err);
  } finally {
    if (require.main === module) {
      await disconnectDB();
    }
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
