/**
 * Cross-Team Unit Test Suite (Dheeraj DB Schemas, Nikhil REST Controllers, Navya UI Validators)
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Traceability: Full Team Module Verification across Sprint-2 (Zero edits to teammate folders)
 * Usage: node --test tests/teamModulesUnit.test.js
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return {
        json: (data) => {
          this.body = data;
          return this;
        }
      };
    }
  };
}

// ==========================================================
// 1. DHEERAJ MODULE UNIT TESTS (Mongoose Schemas & Seed Data)
// ==========================================================
test('Dheeraj: User, StudentProfile & Application schemas enforce validation and unique indexes', () => {
  const User = require('../../dheeraj/models/User');
  const StudentProfile = require('../../dheeraj/models/StudentProfile');
  const Application = require('../../dheeraj/models/Application');
  const seedData = require('../../dheeraj/seed/seedData.json');

  // User validation branches
  const validUser = new User({ name: 'Test User', email: 'test@pes.edu', password: 'Password123', role: 'student' });
  assert.equal(validUser.validateSync(), undefined);

  const badEmailUser = new User({ name: 'Test User', email: 'bad-email', password: 'Password123', role: 'student' });
  assert.ok(badEmailUser.validateSync().errors.email);

  const shortPassUser = new User({ name: 'Test User', email: 'ok@pes.edu', password: '123', role: 'student' });
  assert.ok(shortPassUser.validateSync().errors.password);

  const badRoleUser = new User({ name: 'Test User', email: 'ok@pes.edu', password: 'Password123', role: 'superadmin' });
  assert.ok(badRoleUser.validateSync().errors.role);

  // StudentProfile CGPA & semester boundaries
  const mongoose = require('mongoose');
  const fakeStudentId = new mongoose.Types.ObjectId();
  const validProfile = new StudentProfile({ student: fakeStudentId, usn: 'PES2UG24CS341', cgpa: 8.9, semester: 5 });
  assert.equal(validProfile.validateSync(), undefined);

  const lowCgpa = new StudentProfile({ student: fakeStudentId, cgpa: -0.5 });
  assert.ok(lowCgpa.validateSync().errors.cgpa);

  const highCgpa = new StudentProfile({ student: fakeStudentId, cgpa: 10.5 });
  assert.ok(highCgpa.validateSync().errors.cgpa);

  // Application compound unique index check (IPR-F-009)
  const indexes = Application.schema.indexes();
  const hasCompoundUnique = indexes.some(
    ([fields, opts]) => fields.student === 1 && fields.internship === 1 && opts && opts.unique === true
  );
  assert.equal(hasCompoundUnique, true, 'Application schema must define unique index on { student: 1, internship: 1 }');

  // Seed dataset check
  assert.ok(Array.isArray(seedData.aptitudeTests) && seedData.aptitudeTests.length > 0);
});

// ==========================================================
// 2. NIKHIL MODULE UNIT TESTS (Controllers & Error Handler)
// ==========================================================
test('Nikhil: errorHandler maps 11000, CastError, ValidationError, JWT errors & default 500', () => {
  const errorHandler = require('../../Nikhil_Raj/src/middleware/errorHandler');
  const mockReq = { method: 'POST', originalUrl: '/api/applications' };

  const resDup = createMockRes();
  errorHandler({ code: 11000, message: 'dup' }, mockReq, resDup, () => {});
  assert.equal(resDup.statusCode, 409);

  const resCast = createMockRes();
  errorHandler({ name: 'CastError', value: 'bad_id', message: 'cast' }, mockReq, resCast, () => {});
  assert.equal(resCast.statusCode, 400);

  const resVal = createMockRes();
  errorHandler({ name: 'ValidationError', errors: { cgpa: { message: 'Invalid CGPA' } } }, mockReq, resVal, () => {});
  assert.equal(resVal.statusCode, 400);
  assert.match(resVal.body.message, /Invalid CGPA/);

  const resJwt = createMockRes();
  errorHandler({ name: 'JsonWebTokenError', message: 'jwt' }, mockReq, resJwt, () => {});
  assert.equal(resJwt.statusCode, 401);

  const resExp = createMockRes();
  errorHandler({ name: 'TokenExpiredError', message: 'exp' }, mockReq, resExp, () => {});
  assert.equal(resExp.statusCode, 401);

  const res500 = createMockRes();
  res500.statusCode = 200;
  errorHandler({ message: 'Unexpected crash' }, mockReq, res500, () => {});
  assert.equal(res500.statusCode, 500);
});

test('Nikhil: profileController, internshipController & applicationController cover validation & 409 conflict', async () => {
  const profileController = require('../../Nikhil_Raj/src/controllers/profileController');
  const internshipController = require('../../Nikhil_Raj/src/controllers/internshipController');
  const applicationController = require('../../Nikhil_Raj/src/controllers/applicationController');

  // Profile get & update validation branches
  const resProfGet = createMockRes();
  await profileController.getMyProfile({ user: { email: 'sohel@pes.edu', id: 'usr_student_01' } }, resProfGet, () => {});
  assert.equal(resProfGet.statusCode, 200);
  assert.equal(resProfGet.body.data.usn, 'PES2UG25CS826');

  const resBadCgpa = createMockRes();
  await profileController.updateMyProfile({ user: { email: 'sohel@pes.edu' }, body: { cgpa: 11 } }, resBadCgpa, () => {});
  assert.equal(resBadCgpa.statusCode, 400);

  const resBadSem = createMockRes();
  await profileController.updateMyProfile({ user: { email: 'sohel@pes.edu' }, body: { semester: 10 } }, resBadSem, () => {});
  assert.equal(resBadSem.statusCode, 400);

  const resValidProf = createMockRes();
  await profileController.updateMyProfile(
    { user: { email: 'sohel@pes.edu' }, body: { cgpa: 9.1, semester: 6, skills: 'Node.js, React' } },
    resValidProf,
    () => {}
  );
  assert.equal(resValidProf.statusCode, 200);
  assert.deepEqual(resValidProf.body.data.skills, ['Node.js', 'React']);

  // Internship filters (search, type, location, company)
  const resIntSearch = createMockRes();
  await internshipController.getInternships({ query: { search: 'Google', location: 'Bengaluru' } }, resIntSearch, () => {});
  assert.equal(resIntSearch.statusCode, 200);
  assert.ok(resIntSearch.body.data.some((i) => i.company === 'Google'));

  const resIntByIdMissing = createMockRes();
  await internshipController.getInternshipById({ params: { id: 'nonexistent_id' } }, resIntByIdMissing, () => {});
  assert.equal(resIntByIdMissing.statusCode, 404);

  // Application 201 apply + 409 duplicate check
  const applyReq = {
    params: { id: 'int_003' },
    user: { id: 'usr_unit_tester', email: 'unit.tester@pes.edu', name: 'Unit Tester' },
    body: { coverNote: 'Applying to AWS DevOps intern' }
  };
  const resApply1 = createMockRes();
  await applicationController.applyForInternship(applyReq, resApply1, () => {});
  assert.equal(resApply1.statusCode, 201);

  const resApplyDup = createMockRes();
  await applicationController.applyForInternship(applyReq, resApplyDup, () => {});
  assert.equal(resApplyDup.statusCode, 409);

  const resMyApps = createMockRes();
  await applicationController.getMyApplications({ user: { id: 'usr_unit_tester', email: 'unit.tester@pes.edu' } }, resMyApps, () => {});
  assert.equal(resMyApps.statusCode, 200);
  assert.ok(resMyApps.body.data.length >= 1);
});

test('Nikhil: testController, progressController & adminController execute core business logic', async () => {
  const testController = require('../../Nikhil_Raj/src/controllers/testController');
  const progressController = require('../../Nikhil_Raj/src/controllers/progressController');
  const adminController = require('../../Nikhil_Raj/src/controllers/adminController');

  const resTests = createMockRes();
  await testController.getAptitudeTests({}, resTests, () => {});
  assert.equal(resTests.statusCode, 200);
  assert.ok(resTests.body.data.length > 0);

  // Verify correctOption is stripped before attempt (IPR-F-011)
  const resTestOne = createMockRes();
  await testController.getAptitudeTestById({ params: { id: 'test_001' } }, resTestOne, () => {});
  assert.equal(resTestOne.statusCode, 200);
  assert.equal(resTestOne.body.data.questions[0].correctOption, undefined);

  const resMissingAnswers = createMockRes();
  await testController.submitAptitudeTest({ params: { id: 'test_001' }, body: {} }, resMissingAnswers, () => {});
  assert.equal(resMissingAnswers.statusCode, 400);

  const resProg = createMockRes();
  await progressController.getMyProgress({ user: { id: 'usr_student_01' } }, resProg, () => {});
  assert.equal(resProg.statusCode, 200);
  assert.ok(resProg.body.data.analytics.overallPercentage >= 0);

  const resAdmin = createMockRes();
  await adminController.getSystemMetrics({}, resAdmin, () => {});
  assert.equal(resAdmin.statusCode, 200);
  assert.match(resAdmin.body.data.systemHealth, /OPERATIONAL/);
});

// ==========================================================
// 3. NAVYA MODULE UNIT TESTS (Frontend Validators & Component Tree)
// ==========================================================
test('Navya: frontend validators enforce PES USN, CGPA, email, password & URL checks', async () => {
  const validatorsPath = path.resolve(__dirname, '../../navya/src/utils/validators.js');
  const validators = await import(pathToFileURL(validatorsPath).href);

  assert.equal(validators.isValidEmail('navya@pes.edu'), true);
  assert.equal(validators.isValidEmail('bad-email'), false);

  assert.equal(validators.isValidUSN('PES2UG24CS308'), true);
  assert.equal(validators.isValidUSN('INVALID123'), false);
  assert.equal(validators.isValidUSN(''), false);

  assert.equal(validators.isValidCGPA(9.2), true);
  assert.equal(validators.isValidCGPA(-1), false);
  assert.equal(validators.isValidCGPA(10.5), false);

  assert.equal(validators.isValidPassword('Strong123'), true);
  assert.equal(validators.isValidPassword('123'), false);

  assert.equal(validators.isValidUrl(''), true);
  assert.equal(validators.isValidUrl('https://github.com/Navya-1229'), true);
  assert.equal(validators.isValidUrl('not a valid url'), false);

  assert.match(validators.formatCurrencyINR(95000), /95,000/);

  // Confirm key modular React files exist
  assert.equal(fs.existsSync(path.resolve(__dirname, '../../navya/src/App.jsx')), true);
  assert.equal(fs.existsSync(path.resolve(__dirname, '../../navya/tests/uiSmokeTest.js')), true);
});
