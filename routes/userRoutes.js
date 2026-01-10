const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, gradeLevel } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'EMAIL_ALREADY_EXISTS' });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'USERNAME_ALREADY_EXISTS' });
    }

    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      gradeLevel
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gradeLevel: user.gradeLevel,
        xpPoints: user.xpPoints,
        level: user.level
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credențiale invalide' });
    }

    // Check password
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credențiale invalide' });
    }

    // Update last active
    user.lastActive = Date.now();
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gradeLevel: user.gradeLevel,
        xpPoints: user.xpPoints,
        level: user.level,
        streak: user.streak,
        hearts: user.hearts
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Eroare de server', error: error.message });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Return user profile without password
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user preferences
router.put('/preferences', authMiddleware, async (req, res) => {
  try {
    const { aiTeacherGender, notificationsEnabled, dailyGoal } = req.body;

    // Update only provided fields
    if (aiTeacherGender !== undefined) {
      req.user.preferences.aiTeacherGender = aiTeacherGender;
    }

    if (notificationsEnabled !== undefined) {
      req.user.preferences.notificationsEnabled = notificationsEnabled;
    }

    if (dailyGoal !== undefined) {
      req.user.preferences.dailyGoal = dailyGoal;
    }

    await req.user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: req.user.preferences
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, username, email, gradeLevel } = req.body;
    const userId = req.user._id;

    // Check if username already exists (if username is being changed)
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    // Check if email already exists (if email is being changed)
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        username,
        email,
        gradeLevel
      },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update streak
router.put('/streak', authMiddleware, async (req, res) => {
  try {
    // Check if user has been active today
    const today = new Date();
    const lastActive = new Date(req.user.lastActive);

    // If last active was not today (comparing day, month, year)
    if (lastActive.getDate() !== today.getDate() ||
        lastActive.getMonth() !== today.getMonth() ||
        lastActive.getFullYear() !== today.getFullYear()) {

      // Check if last active was yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActive.getDate() === yesterday.getDate() &&
          lastActive.getMonth() === yesterday.getMonth() &&
          lastActive.getFullYear() === yesterday.getFullYear()) {
        // Increment streak if last active was yesterday
        req.user.streak += 1;
      } else {
        // Reset streak if last active was not yesterday
        req.user.streak = 1;
      }
    }

    // Update last active
    req.user.lastActive = today;
    await req.user.save();

    res.json({
      message: 'Streak updated successfully',
      streak: req.user.streak
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
