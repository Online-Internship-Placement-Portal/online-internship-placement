/**
 * Preparation Progress & Analytics Routes
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-014, IPR-F-015, TC-Prog-01, TC-Prog-02
 */

const express = require('express');
const router = express.Router();
let authMiddleware, rbacMiddleware;
try {
  authMiddleware = require('../../../sohel - Authentication and Integration/middleware/authMiddleware');
  rbacMiddleware = require('../../../sohel - Authentication and Integration/middleware/rbacMiddleware');
} catch (e) {
  authMiddleware = require('../../../sohel/middleware/authMiddleware');
  rbacMiddleware = require('../../../sohel/middleware/rbacMiddleware');
}
const { authenticateToken } = authMiddleware;
const { authorizeRoles } = rbacMiddleware;

let inMemoryProgress = [
  { id: 'p1', topic: 'Binary Search & Two Pointers', category: 'Algorithms', completed: true, score: 92, lastUpdated: new Date() },
  { id: 'p2', topic: 'Dynamic Programming & Memoization', category: 'Algorithms', completed: false, score: 60, lastUpdated: new Date() },
  { id: 'p3', topic: 'Database Normalization & SQL Queries', category: 'Core CS Concepts', completed: true, score: 88, lastUpdated: new Date() },
  { id: 'p4', topic: 'Quantitative Aptitude (Speed & Distance)', category: 'Aptitude', completed: true, score: 95, lastUpdated: new Date() }
];

/**
 * GET /api/progress/me
 * Student views preparation progress and analytics breakdown (IPR-F-014, IPR-F-015)
 */
router.get('/me', authenticateToken, authorizeRoles('student'), (req, res) => {
  const totalTopics = inMemoryProgress.length;
  const completedTopics = inMemoryProgress.filter(p => p.completed).length;
  const overallPercentage = Math.round((completedTopics / totalTopics) * 100);
  const averageScore = Math.round(inMemoryProgress.reduce((acc, curr) => acc + curr.score, 0) / totalTopics);

  res.status(200).json({
    success: true,
    data: {
      topics: inMemoryProgress,
      analytics: {
        totalTopics,
        completedTopics,
        overallPercentage,
        averageScore,
        readinessStatus: overallPercentage >= 70 ? 'High Readiness' : 'In Progress'
      }
    }
  });
});

/**
 * PUT /api/progress/me
 * Student updates a progress item (IPR-F-014 / TC-Prog-01)
 */
router.put('/me', authenticateToken, authorizeRoles('student'), (req, res) => {
  const { topic, completed, score } = req.body;
  if (!topic) {
    return res.status(400).json({ success: false, message: 'Topic name is required.' });
  }

  let item = inMemoryProgress.find(p => p.topic.toLowerCase() === topic.toLowerCase());
  if (item) {
    if (completed !== undefined) item.completed = completed;
    if (score !== undefined) item.score = score;
    item.lastUpdated = new Date();
  } else {
    item = {
      id: 'p_' + Date.now(),
      topic,
      completed: completed || false,
      score: score || 0,
      lastUpdated: new Date()
    };
    inMemoryProgress.push(item);
  }

  res.status(200).json({
    success: true,
    message: 'Preparation progress updated successfully.',
    data: item
  });
});

module.exports = router;
