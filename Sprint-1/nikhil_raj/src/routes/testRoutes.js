/**
 * Aptitude Test & Evaluation Routes
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-011, IPR-F-012, IPR-F-013, TC-Test-01, TC-Test-02, TC-Test-03
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../../sohel/middleware/authMiddleware');
const { authorizeRoles } = require('../../../sohel/middleware/rbacMiddleware');

// Seed test questions in memory fallback
const inMemoryTests = [
  {
    id: 'test_apt_01',
    _id: 'test_apt_01',
    title: 'Placement Technical & Aptitude Test 2026',
    category: 'Quantitative & Core CS',
    durationMinutes: 20,
    totalMarks: 3,
    questions: [
      {
        id: 'q1',
        _id: 'q1',
        questionText: 'A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?',
        options: { A: '120 metres', B: '150 metres', C: '180 metres', D: '324 metres' },
        correctOption: 'B',
        marks: 1
      },
      {
        id: 'q2',
        _id: 'q2',
        questionText: 'What is the worst-case time complexity of QuickSort?',
        options: { A: 'O(n log n)', B: 'O(n)', C: 'O(n^2)', D: 'O(log n)' },
        correctOption: 'C',
        marks: 1
      },
      {
        id: 'q3',
        _id: 'q3',
        questionText: 'Which HTTP status code signifies a Conflict (e.g. duplicate application) in REST API?',
        options: { A: '400', B: '401', C: '404', D: '409' },
        correctOption: 'D',
        marks: 1
      }
    ]
  }
];

const inMemoryResults = [];

const getTestModels = () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return {
        AptitudeTest: mongoose.model('AptitudeTest'),
        TestResult: mongoose.model('TestResult')
      };
    }
  } catch (e) {}
  return null;
};

/**
 * GET /api/tests
 * View available aptitude tests (IPR-F-011)
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const models = getTestModels();
    if (models) {
      // Exclude correctOption when returning to student
      const tests = await models.AptitudeTest.find().select('-questions.correctOption');
      return res.status(200).json({ success: true, count: tests.length, data: tests });
    }

    // In-memory (mask correct option)
    const sanitized = inMemoryTests.map(t => ({
      ...t,
      questions: t.questions.map(q => ({
        id: q.id,
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        marks: q.marks
      }))
    }));

    res.status(200).json({ success: true, count: sanitized.length, data: sanitized });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tests/:id/submit
 * Submit answers and automatically evaluate score (IPR-F-012 / TC-Test-02)
 */
router.post('/:id/submit', authenticateToken, authorizeRoles('student'), async (req, res, next) => {
  try {
    const { answers } = req.body; // Map or object of { questionId: selectedOption }
    const testId = req.params.id;
    const studentId = req.user.id;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission. Answers object is required.'
      });
    }

    const test = inMemoryTests.find(t => t.id === testId || t._id === testId);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found.' });
    }

    // Calculate score automatically (IPR-F-012)
    let calculatedScore = 0;
    const evaluatedAnswers = test.questions.map(q => {
      const selected = answers[q.id] || answers[q._id];
      const isCorrect = selected === q.correctOption;
      if (isCorrect) {
        calculatedScore += q.marks;
      }
      return {
        questionId: q.id,
        selectedOption: selected,
        correctOption: q.correctOption,
        isCorrect
      };
    });

    const percentage = Math.round((calculatedScore / test.totalMarks) * 100);

    const resultRecord = {
      id: 'res_' + Date.now(),
      _id: 'res_' + Date.now(),
      student: studentId,
      test: testId,
      testTitle: test.title,
      score: calculatedScore,
      totalMarks: test.totalMarks,
      percentage,
      evaluatedAnswers,
      completedAt: new Date()
    };

    inMemoryResults.push(resultRecord);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Aptitude test evaluated successfully.',
      result: {
        score: calculatedScore,
        totalMarks: test.totalMarks,
        percentage: `${percentage}%`,
        status: percentage >= 50 ? 'PASSED' : 'NEEDS_PRACTICE',
        details: evaluatedAnswers
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/test-results/me
 * Student views test scores and history (IPR-F-013, TC-Test-03)
 */
router.get('/results/me', authenticateToken, authorizeRoles('student'), async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const userResults = inMemoryResults.filter(r => r.student === studentId);
    res.status(200).json({ success: true, count: userResults.length, data: userResults });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
