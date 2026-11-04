/**
 * Placement Preparation Progress & Analytics Controller (Sprint-2)
 * Author: Nikhil Raj G (PES2UG24CS319)
 * Role: Backend Setup
 * Traceability: IPR-F-014, IPR-F-015, TC-Prog-01, TC-Prog-02
 */

let inMemoryProgress = [
  { id: 'p1', topic: 'Arrays & Two Pointer Techniques', category: 'Data Structures', completed: true, score: 95, lastUpdated: new Date() },
  { id: 'p2', topic: 'Binary Search & Monotonic Predicates', category: 'Algorithms', completed: true, score: 90, lastUpdated: new Date() },
  { id: 'p3', topic: 'Dynamic Programming & Tabulation', category: 'Algorithms', completed: false, score: 65, lastUpdated: new Date() },
  { id: 'p4', topic: 'Trees & Binary Search Trees (BST)', category: 'Data Structures', completed: true, score: 85, lastUpdated: new Date() },
  { id: 'p5', topic: 'Database Normalization & B+ Tree Indexing', category: 'Core CS Concepts', completed: true, score: 88, lastUpdated: new Date() },
  { id: 'p6', topic: 'Operating Systems (Virtual Memory & Threads)', category: 'Core CS Concepts', completed: false, score: 70, lastUpdated: new Date() },
  { id: 'p7', topic: 'Time & Work / Speed & Distance', category: 'Aptitude', completed: true, score: 92, lastUpdated: new Date() },
  { id: 'p8', topic: 'System Design: Microservices & Caching', category: 'System Design', completed: true, score: 80, lastUpdated: new Date() }
];

const getProgressModel = () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        return mongoose.model('PreparationProgress');
      } catch (e) {
        return require('../../../dheeraj/models/PreparationProgress');
      }
    }
  } catch (e) {}
  return null;
};

/**
 * GET /api/progress/me
 * Student views placement preparation topics, breakdown, and overall readiness analytics (IPR-F-014, IPR-F-015)
 */
const getMyProgress = async (req, res, next) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const ProgressModel = getProgressModel();

    let topics = inMemoryProgress;
    if (ProgressModel && studentId) {
      const dbTopics = await ProgressModel.find({ student: studentId });
      if (dbTopics && dbTopics.length > 0) {
        topics = dbTopics;
      }
    }

    const totalTopics = topics.length;
    const completedTopics = topics.filter(t => t.completed).length;
    const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    const averageScore = totalTopics > 0 ? Math.round(topics.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalTopics) : 0;

    // Category breakdown analytics (IPR-F-015, TC-Prog-02)
    const categoryStats = {};
    topics.forEach(t => {
      if (!categoryStats[t.category]) {
        categoryStats[t.category] = { total: 0, completed: 0, totalScore: 0 };
      }
      categoryStats[t.category].total += 1;
      if (t.completed) categoryStats[t.category].completed += 1;
      categoryStats[t.category].totalScore += (t.score || 0);
    });

    const categoryBreakdown = Object.keys(categoryStats).map(cat => ({
      category: cat,
      completionRate: Math.round((categoryStats[cat].completed / categoryStats[cat].total) * 100),
      avgScore: Math.round(categoryStats[cat].totalScore / categoryStats[cat].total),
      completedCount: categoryStats[cat].completed,
      totalCount: categoryStats[cat].total
    }));

    res.status(200).json({
      success: true,
      data: {
        topics,
        analytics: {
          totalTopics,
          completedTopics,
          overallPercentage,
          averageScore,
          placementReadinessIndex: `${overallPercentage}%`,
          statusBenchmark: overallPercentage >= 75 ? 'Placement Ready' : 'In Preparation',
          categoryBreakdown
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/progress/me
 * Update topic completion status or score (IPR-F-014, TC-Prog-01)
 */
const updateTopicProgress = async (req, res, next) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const { topic, completed, score } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, message: 'Topic name is required.' });
    }

    const ProgressModel = getProgressModel();
    if (ProgressModel && studentId) {
      const updated = await ProgressModel.findOneAndUpdate(
        { student: studentId, topic },
        {
          $set: {
            completed: completed !== undefined ? completed : true,
            score: score !== undefined ? score : undefined,
            lastUpdated: new Date()
          }
        },
        { new: true, upsert: true }
      );
      return res.status(200).json({ success: true, message: 'Progress updated.', data: updated });
    }

    // In-memory update
    const idx = inMemoryProgress.findIndex(p => p.topic.toLowerCase() === topic.toLowerCase());
    if (idx !== -1) {
      inMemoryProgress[idx].completed = completed !== undefined ? completed : !inMemoryProgress[idx].completed;
      if (score !== undefined) inMemoryProgress[idx].score = score;
      inMemoryProgress[idx].lastUpdated = new Date();
    } else {
      inMemoryProgress.push({
        id: `p_${Date.now()}`,
        topic,
        category: 'Data Structures',
        completed: completed !== undefined ? completed : true,
        score: score !== undefined ? score : 80,
        lastUpdated: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Progress updated (in-memory).',
      data: inMemoryProgress
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyProgress,
  updateTopicProgress,
  inMemoryProgress
};
