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

    // Validate password strength
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'PASSWORD_TOO_SHORT', details: 'Password must be at least 6 characters long' });
    }

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
    res.status(500).json({ message: 'Error updating preferences', error: error.message });
  }
});

// Update user streak
router.put('/streak', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize streak if not exists
    if (!user.streak) {
      user.streak = 0;
    }

    // Get last activity date
    const lastActivityDate = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user already has activity today
    if (lastActivityDate) {
      lastActivityDate.setHours(0, 0, 0, 0);
      if (lastActivityDate.getTime() === today.getTime()) {
        // Already updated today
        return res.json({ streak: user.streak });
      }

      // Check if streak should continue (activity yesterday)
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActivityDate.getTime() === yesterday.getTime()) {
        // Continue streak
        user.streak += 1;
      } else {
        // Streak broken, restart
        user.streak = 1;
      }
    } else {
      // First activity
      user.streak = 1;
    }

    // Update last activity date
    user.lastActivityDate = new Date();
    await user.save();

    res.json({ streak: user.streak });
  } catch (error) {
    res.status(500).json({ message: 'Error updating streak', error: error.message });
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

// Save assessment results
router.put('/assessment', authMiddleware, async (req, res) => {
  try {
    const { assessmentLevel, assessmentScore, assessmentCompleted } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update assessment fields
    user.assessmentLevel = assessmentLevel || 'neevaluated';
    user.assessmentScore = assessmentScore || 0;
    user.assessmentCompleted = assessmentCompleted || false;
    user.assessmentDate = new Date();

    await user.save();

    res.json({
      message: 'Assessment saved successfully',
      assessmentLevel: user.assessmentLevel,
      assessmentScore: user.assessmentScore,
      assessmentCompleted: user.assessmentCompleted
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit evaluation form during account creation
router.post('/evaluate', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body; // answers: { matematica: count, limba: count }

    if (!answers || typeof answers.matematica !== 'number' || typeof answers.limba !== 'number') {
      return res.status(400).json({ message: 'Invalid evaluation data' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate scores
    const totalCorrect = answers.matematica + answers.limba;
    let nivelCunostinte = 'Incepator';

    if (totalCorrect >= 7) {
      nivelCunostinte = 'Avansat';
    } else if (totalCorrect >= 4) {
      nivelCunostinte = 'Mediu';
    }

    // Update user with evaluation results
    user.evaluationScores = {
      matematica: answers.matematica,
      limba: answers.limba,
      total: totalCorrect,
      completedAt: new Date()
    };
    user.nivelCunostinte = nivelCunostinte;

    await user.save();

    res.json({
      message: 'Evaluation completed successfully',
      scores: user.evaluationScores,
      nivelCunostinte: user.nivelCunostinte
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get evaluation questions by grade level
router.get('/evaluation-questions/:gradeLevel', async (req, res) => {
  try {
    const gradeLevel = parseInt(req.params.gradeLevel);

    // Map grade level to class name
    const gradeMap = {
      5: 'Clasa a V a',
      6: 'Clasa a VI a',
      7: 'Clasa a VII a',
      8: 'Clasa a VIII a'
    };

    const className = gradeMap[gradeLevel];

    if (!className) {
      return res.status(400).json({
        message: 'Invalid grade level. Must be 5, 6, 7, or 8'
      });
    }

    // Read curriculum file - try multiple possible paths
    const fs = require('fs');
    const path = require('path');

    // Try multiple paths to find curriculum file
    const possiblePaths = [
      path.join(__dirname, 'curriculum_structure.json'),
      path.join(__dirname, '../../curriculum_structure.json'),
      path.join(__dirname, '../curriculum_structure.json'),
      path.join(process.cwd(), 'curriculum_structure.json'),
      path.join(process.cwd(), 'backend', 'curriculum_structure.json'),
      '/app/curriculum_structure.json',
      '/app/backend/curriculum_structure.json'
    ];

    let curriculum = null;
    let foundPath = null;

    for (const curriculumPath of possiblePaths) {
      if (fs.existsSync(curriculumPath)) {
        try {
          curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
          foundPath = curriculumPath;
          console.log(`Found curriculum at: ${foundPath}`);
          break;
        } catch (parseErr) {
          console.error(`Error parsing curriculum at ${curriculumPath}:`, parseErr);
        }
      }
    }

    if (!curriculum) {
      console.warn('Curriculum file not found, returning placeholder questions');
      return res.json(getPlaceholderQuestions(gradeLevel));
    }

    const classData = curriculum[className];

    if (!classData) {
      console.warn(`Class data not found for ${className}`);
      return res.json(getPlaceholderQuestions(gradeLevel));
    }

    // Get questions from curriculum
    const evaluationQuestions = extractEvaluationQuestions(classData, gradeLevel);
    console.log(`Extracted evaluation questions for ${className}:`, {
      matematicaCount: evaluationQuestions.matematica.length,
      limbaCount: evaluationQuestions.limba.length
    });
    res.json(evaluationQuestions);
  } catch (error) {
    console.error('Error fetching evaluation questions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to extract 4 math + 4 language questions
function extractEvaluationQuestions(classData, gradeLevel) {
  const result = {
    matematica: [],
    limba: []
  };

  try {
    // Find Limba key (it could have different characters)
    const limbaKey = Object.keys(classData).find(k => k.includes('Limba'));

    console.log(`Available keys in classData: ${Object.keys(classData)}`);
    console.log(`Found Limba key: ${limbaKey}`);

    // Get Limba questions
    if (limbaKey && classData[limbaKey]) {
      const limbaUnits = classData[limbaKey];
      let limbaCount = 0;

      for (const unit of limbaUnits) {
        if (limbaCount >= 4) break;

        for (const lesson of unit.lectii || []) {
          if (limbaCount >= 4) break;

          if (lesson.questions && lesson.questions.length > 0) {
            const q = lesson.questions[0]; // Take first question from lesson
            // Clean up options by removing letter prefixes (A. , B. , C. , D. )
            const cleanedOptions = q.options.map(opt =>
              opt.replace(/^[A-D]\.\s*/, '').trim()
            );
            result.limba.push({
              id: `limba${limbaCount + 1}`,
              subject: 'Limba si literatura romana',
              question: q.questionText,
              options: cleanedOptions,
              correctAnswer: q.correctAnswerIndex
            });
            limbaCount++;
            console.log(`Extracted Limba question ${limbaCount}: ${q.questionText ? q.questionText.substring(0, 50) : 'NO TEXT'}...`);
          }
        }
      }
    }

    // Get Matematica questions
    if (classData['Matematica']) {
      const mathUnits = classData['Matematica'];
      let mathCount = 0;

      for (const unit of mathUnits) {
        if (mathCount >= 4) break;

        for (const lesson of unit.lectii || []) {
          if (mathCount >= 4) break;

          if (lesson.questions && lesson.questions.length > 0) {
            const q = lesson.questions[0]; // Take first question from lesson
            // Clean up options by removing letter prefixes (A. , B. , C. , D. )
            const cleanedOptions = q.options.map(opt =>
              opt.replace(/^[A-D]\.\s*/, '').trim()
            );
            result.matematica.push({
              id: `math${mathCount + 1}`,
              subject: 'Matematica',
              question: q.questionText,
              options: cleanedOptions,
              correctAnswer: q.correctAnswerIndex
            });
            mathCount++;
            console.log(`Extracted Math question ${mathCount}: ${q.questionText ? q.questionText.substring(0, 50) : 'NO TEXT'}...`);
          }
        }
      }
    }

    console.log(`Total extracted - Math: ${result.matematica.length}, Limba: ${result.limba.length}`);

    // If we don't have enough questions, pad with placeholders
    while (result.limba.length < 4) {
      result.limba.push({
        id: `limba${result.limba.length + 1}`,
        subject: 'Limba si literatura romana',
        question: `Clasa a ${gradeLevel}a - Întrebare Limba ${result.limba.length + 1}?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: result.limba.length % 4
      });
    }

    while (result.matematica.length < 4) {
      result.matematica.push({
        id: `math${result.matematica.length + 1}`,
        subject: 'Matematica',
        question: `Clasa a ${gradeLevel}a - Întrebare Matematică ${result.matematica.length + 1}?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: result.matematica.length % 4
      });
    }

    return result;
  } catch (error) {
    console.error('Error extracting questions:', error);
    return getPlaceholderQuestions(gradeLevel);
  }
}

// Placeholder questions fallback
function getPlaceholderQuestions(gradeLevel) {
  return {
    matematica: [
      {
        id: 'math1',
        subject: 'Matematica',
        question: `Clasa a ${gradeLevel}a - Întrebare Matematică 1?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0
      },
      {
        id: 'math2',
        subject: 'Matematica',
        question: `Clasa a ${gradeLevel}a - Întrebare Matematică 2?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 1
      },
      {
        id: 'math3',
        subject: 'Matematica',
        question: `Clasa a ${gradeLevel}a - Întrebare Matematică 3?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 2
      },
      {
        id: 'math4',
        subject: 'Matematica',
        question: `Clasa a ${gradeLevel}a - Întrebare Matematică 4?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 3
      }
    ],
    limba: [
      {
        id: 'limba1',
        subject: 'Limba si literatura romana',
        question: `Clasa a ${gradeLevel}a - Întrebare Limba 1?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0
      },
      {
        id: 'limba2',
        subject: 'Limba si literatura romana',
        question: `Clasa a ${gradeLevel}a - Întrebare Limba 2?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 1
      },
      {
        id: 'limba3',
        subject: 'Limba si literatura romana',
        question: `Clasa a ${gradeLevel}a - Întrebare Limba 3?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 2
      },
      {
        id: 'limba4',
        subject: 'Limba si literatura romana',
        question: `Clasa a ${gradeLevel}a - Întrebare Limba 4?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 3
      }
    ]
  };
}

module.exports = router;
