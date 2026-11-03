/**
 * Aptitude Test & Evaluation Controller (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-011, IPR-F-012, IPR-F-013, TC-Test-01, TC-Test-02, TC-Test-03
 */

const seedData = require('../../../dheeraj/seed/seedData.json');

let inMemoryTests = seedData.aptitudeTests.map((t, idx) => ({
  id: `test_00${idx + 1}`,
  _id: `test_00${idx + 1}`,
  ...t,
  questions: t.questions.map((q, qIdx) => ({
    id: `q_${idx + 1}_${qIdx + 1}`,
    _id: `q_${idx + 1}_${qIdx + 1}`,
    ...q
  }))
}));

let inMemoryTestResults = [
  {
    id: 'res_001',
    _id: 'res_001',
    student: 'usr_student_01',
    studentEmail: 'sohel@pes.edu',
    testId: 'test_001',
    testTitle: 'Technical & Core CS Assessment 2026',
    category: 'Technical & Data Structures',
    score: 5,
    totalMarks: 5,
    percentage: 100,
    passed: true,
    durationTakenSeconds: 720,
    submittedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    answers: [
      { questionText: 'Worst-case QuickSort complexity?', selectedOption: 'C', correctOption: 'C', isCorrect: true, explanation: 'Extreme pivot yields O(n^2).' },
      { questionText: 'BFS traversal data structure?', selectedOption: 'B', correctOption: 'B', isCorrect: true, explanation: 'BFS uses FIFO Queue.' }
    ]
  }
];

const getTestModels = () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      let AptitudeTest, TestResult;
      try {
        AptitudeTest = mongoose.model('AptitudeTest');
      } catch (e) {
        AptitudeTest = require('../../../dheeraj/models/AptitudeTest');
      }
      try {
        TestResult = mongoose.model('TestResult');
      } catch (e) {
        TestResult = require('../../../dheeraj/models/TestResult');
      }
      return { AptitudeTest, TestResult };
    }
  } catch (e) {}
  return null;
};

/**
 * GET /api/tests
 * Retrieve active aptitude tests (IPR-F-011, TC-Test-01)
 */
const getAptitudeTests = async (req, res, next) => {
  try {
    const models = getTestModels();
    if (models && models.AptitudeTest) {
      const tests = await models.AptitudeTest.find({ isActive: true }).select('-questions.correctOption -questions.explanation');
      return res.status(200).json({ success: true, count: tests.length, data: tests });
    }

    // In-memory fallback (omit answers for list)
    const sanitizedTests = inMemoryTests.map(t => ({
      id: t.id,
      _id: t._id,
      title: t.title,
      category: t.category,
      durationMinutes: t.durationMinutes,
      totalMarks: t.totalMarks,
      passingScore: t.passingScore,
      instructions: t.instructions,
      questionCount: t.questions.length
    }));

    res.status(200).json({ success: true, count: sanitizedTests.length, data: sanitizedTests });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tests/:id
 * Retrieve specific test for attempting (strips correct answers to prevent inspection leaks)
 */
const getAptitudeTestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const models = getTestModels();

    if (models && models.AptitudeTest) {
      const test = await models.AptitudeTest.findById(id);
      if (!test) return res.status(404).json({ success: false, message: 'Test not found.' });

      // Omit correctOption and explanation while attempting
      const safeTest = test.toObject();
      safeTest.questions = safeTest.questions.map(q => {
        const { correctOption, explanation, ...safeQ } = q;
        return safeQ;
      });

      return res.status(200).json({ success: true, data: safeTest });
    }

    const test = inMemoryTests.find(t => t.id === id || t._id === id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found.' });

    const safeQuestions = test.questions.map(q => ({
      id: q.id || q._id,
      _id: q._id || q.id,
      questionText: q.questionText,
      options: q.options,
      marks: q.marks
    }));

    res.status(200).json({
      success: true,
      data: {
        id: test.id,
        _id: test._id,
        title: test.title,
        category: test.category,
        durationMinutes: test.durationMinutes,
        totalMarks: test.totalMarks,
        passingScore: test.passingScore,
        instructions: test.instructions,
        questions: safeQuestions
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/tests/:id/submit
 * Evaluate student test answers, calculate score automatically and persist in history (IPR-F-012, IPR-F-013, TC-Test-02, TC-Test-03)
 */
const submitAptitudeTest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers, durationTakenSeconds } = req.body;
    const studentId = req.user?.id || req.user?._id || 'usr_student_01';
    const studentEmail = req.user?.email || 'sohel@pes.edu';

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, message: 'Submitted answers object is required.' });
    }

    const models = getTestModels();
    let targetTest = null;

    if (models && models.AptitudeTest) {
      targetTest = await models.AptitudeTest.findById(id);
    }
    if (!targetTest) {
      targetTest = inMemoryTests.find(t => t.id === id || t._id === id);
    }
    if (!targetTest) {
      return res.status(404).json({ success: false, message: 'Test not found.' });
    }

    // Auto-calculate score (IPR-F-012, TC-Test-02)
    let obtainedMarks = 0;
    const questions = targetTest.questions || [];
    const questionReview = [];

    questions.forEach((q, index) => {
      const qKey = q._id ? q._id.toString() : (q.id || `q${index + 1}`);
      const selected = answers[qKey] || answers[index] || '';
      const isCorrect = selected.toUpperCase() === q.correctOption.toUpperCase();

      if (isCorrect) {
        obtainedMarks += (q.marks || 1);
      }

      questionReview.push({
        questionId: qKey,
        questionText: q.questionText,
        selectedOption: selected,
        correctOption: q.correctOption,
        isCorrect,
        explanation: q.explanation || 'Standard textbook solution.'
      });
    });

    const totalMarks = targetTest.totalMarks || questions.length;
    const percentage = Math.round((obtainedMarks / totalMarks) * 100);
    const passingScore = targetTest.passingScore || 60;
    const passed = percentage >= passingScore;

    // Persist to test history (IPR-F-013, TC-Test-03)
    if (models && models.TestResult && req.user?.id) {
      const testResult = await models.TestResult.create({
        student: studentId,
        test: targetTest._id,
        score: obtainedMarks,
        totalMarks,
        percentage,
        passed,
        durationTakenSeconds: durationTakenSeconds || 0,
        answers: questionReview
      });

      return res.status(200).json({
        success: true,
        message: 'Aptitude test evaluated and recorded successfully.',
        data: testResult
      });
    }

    // In-memory fallback
    const resultRecord = {
      id: `res_${Date.now()}`,
      _id: `res_${Date.now()}`,
      student: studentId,
      studentEmail,
      testId: targetTest.id || targetTest._id,
      testTitle: targetTest.title,
      category: targetTest.category,
      score: obtainedMarks,
      totalMarks,
      percentage,
      passed,
      durationTakenSeconds: durationTakenSeconds || 300,
      submittedAt: new Date().toISOString(),
      answers: questionReview
    };

    inMemoryTestResults.unshift(resultRecord);

    res.status(200).json({
      success: true,
      message: 'Aptitude test evaluated and recorded successfully (in-memory).',
      data: resultRecord
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tests/history/me
 * Student views complete test history and previous attempts (IPR-F-013, TC-Test-03)
 */
const getTestHistory = async (req, res, next) => {
  try {
    const studentId = req.user?.id || req.user?._id || 'usr_student_01';
    const studentEmail = req.user?.email || 'sohel@pes.edu';
    const models = getTestModels();

    if (models && models.TestResult && req.user?.id) {
      const history = await models.TestResult.find({ student: studentId })
        .populate('test', 'title category durationMinutes totalMarks')
        .sort({ submittedAt: -1 });

      return res.status(200).json({
        success: true,
        count: history.length,
        data: history
      });
    }

    const userHistory = inMemoryTestResults.filter(
      r => r.student === studentId || r.studentEmail === studentEmail
    );

    res.status(200).json({
      success: true,
      count: userHistory.length,
      data: userHistory
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAptitudeTests,
  getAptitudeTestById,
  submitAptitudeTest,
  getTestHistory,
  inMemoryTests,
  inMemoryTestResults
};
