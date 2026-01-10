const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Lesson = require('../models/Lesson');

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

// Get all lessons by subject and grade level
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { subject, gradeLevel } = req.query;
    const query = {};

    if (subject) {
      query.subject = subject;
    }

    if (gradeLevel) {
      query.gradeLevel = gradeLevel;
    } else {
      // If no grade level specified, use the user's grade level
      query.gradeLevel = req.user.gradeLevel;
    }

    const lessons = await Lesson.find(query).sort({ chapter: 1, section: 1 });

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get lesson by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get lessons by chapter
router.get('/chapter/:chapter', authMiddleware, async (req, res) => {
  try {
    const { subject, gradeLevel } = req.query;
    const query = { chapter: req.params.chapter };

    if (subject) {
      query.subject = subject;
    }

    if (gradeLevel) {
      query.gradeLevel = gradeLevel;
    } else {
      query.gradeLevel = req.user.gradeLevel;
    }

    const lessons = await Lesson.find(query).sort({ section: 1 });

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get video lessons
router.get('/videos', authMiddleware, async (req, res) => {
  try {
    const { subject, gradeLevel } = req.query;
    const query = { hasVideo: true };

    if (subject) {
      query.subject = subject;
    }

    if (gradeLevel) {
      query.gradeLevel = gradeLevel;
    } else {
      query.gradeLevel = req.user.gradeLevel;
    }

    const videoLessons = await Lesson.find(query).sort({ chapter: 1, section: 1 });

    res.json(videoLessons);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Create a new lesson (would normally have admin middleware)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      subject,
      gradeLevel,
      chapter,
      section,
      difficulty,
      xpReward,
      duration,
      content,
      videoUrl
    } = req.body;

    const newLesson = new Lesson({
      title,
      subject,
      gradeLevel,
      chapter,
      section,
      difficulty,
      xpReward,
      duration,
      content,
      videoUrl,
      hasVideo: !!videoUrl
    });

    await newLesson.save();

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson: newLesson
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
