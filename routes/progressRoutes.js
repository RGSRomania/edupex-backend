const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const Achievement = require('../models/Achievement');

// Middleware for authentication
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

// Get user's progress for all lessons
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userProgress = await Progress.find({ user: req.user._id })
      .populate('lesson', 'title subject chapter section');

    res.json(userProgress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's progress for a specific lesson
router.get('/lesson/:lessonId', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      lesson: req.params.lessonId
    }).populate('lesson');

    if (!progress) {
      return res.json({ message: 'No progress found for this lesson', progress: null });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit lesson progress
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { lessonId, answers, timeSpent, score } = req.body;

    // Find the lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Calculate XP earned and hearts lost
    const xpEarned = Math.round(lesson.xpReward * (score / 100));
    const heartsLost = answers.filter(answer => !answer.correct).length;

    // Find or create progress record
    let progress = await Progress.findOne({ user: req.user._id, lesson: lessonId });

    if (!progress) {
      // Create new progress record
      progress = new Progress({
        user: req.user._id,
        lesson: lessonId,
        answers,
        timeSpent,
        score,
        xpEarned,
        heartsLost,
        completed: true,
        completedAt: Date.now()
      });
    } else {
      // Update existing progress record
      progress.answers = answers;
      progress.timeSpent = timeSpent;
      progress.score = score;
      progress.xpEarned = xpEarned;
      progress.heartsLost = heartsLost;
      progress.completed = true;
      progress.completedAt = Date.now();
    }

    await progress.save();

    // Update user XP and hearts
    req.user.xpPoints += xpEarned;
    req.user.hearts = Math.max(0, req.user.hearts - heartsLost);

    // Check for level up
    const newLevel = Math.floor(req.user.xpPoints / 100) + 1;
    const leveledUp = newLevel > req.user.level;
    if (leveledUp) {
      req.user.level = newLevel;
    }

    // Update streak (handled in userRoutes)

    await req.user.save();

    res.json({
      message: 'Progress submitted successfully',
      progress,
      user: {
        xpPoints: req.user.xpPoints,
        hearts: req.user.hearts,
        level: req.user.level,
        leveledUp
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's achievements
router.get('/achievements', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('achievements');

    res.json(user.achievements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check for new achievements
router.post('/check-achievements', authMiddleware, async (req, res) => {
  try {
    // Get all achievements
    const allAchievements = await Achievement.find({ isActive: true });

    // Get user's current achievements
    const userAchievements = new Set(req.user.achievements.map(ach => ach.toString()));

    // Get user's progress
    const userProgress = await Progress.find({ user: req.user._id, completed: true });

    // Calculate stats
    const stats = {
      lessonsCompleted: userProgress.length,
      xpTotal: req.user.xpPoints,
      streakDays: req.user.streak,
      perfectLessons: userProgress.filter(p => p.score === 100).length
    };

    // Check for new achievements
    const newAchievements = [];

    for (const achievement of allAchievements) {
      // Skip if user already has this achievement
      if (userAchievements.has(achievement._id.toString())) {
        continue;
      }

      // Check if user qualifies for this achievement
      let qualifies = false;

      switch (achievement.category) {
        case 'streak':
          qualifies = stats.streakDays >= achievement.requirement;
          break;
        case 'lesson':
          qualifies = stats.lessonsCompleted >= achievement.requirement;
          break;
        case 'xp':
          qualifies = stats.xpTotal >= achievement.requirement;
          break;
        case 'quiz':
          qualifies = stats.perfectLessons >= achievement.requirement;
          break;
      }

      if (qualifies) {
        newAchievements.push(achievement);
        req.user.achievements.push(achievement._id);
        req.user.xpPoints += achievement.xpReward;
      }
    }

    // Save user if there are new achievements
    if (newAchievements.length > 0) {
      await req.user.save();
    }

    res.json({
      newAchievements,
      totalAchievements: req.user.achievements.length,
      xpEarned: newAchievements.reduce((total, ach) => total + ach.xpReward, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
