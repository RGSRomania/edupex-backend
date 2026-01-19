const express = require('express');
const router = express.Router();
const {
  Materie,
  Clasa,
  UnitateDeInvatare,
  Capitol,
  Lectie,
  LectieQuestion,
  UserProgress,
  UserAchievement
} = require('../models/Lesson');
const authenticate = require('../middleware/authenticate');

// ==================== MATERIE ROUTES ====================
// PUBLIC ENDPOINTS - NO AUTHENTICATION REQUIRED

// GET test endpoint - just to verify route is accessible
router.get('/test', async (req, res) => {
  res.json({ message: 'Lesson routes are accessible!', timestamp: new Date() });
});

// GET all materii (subjects) - PUBLIC
router.get('/materii', async (req, res) => {
  try {
    // Try to fetch from database
    if (Materie && Materie.find) {
      const materii = await Materie.find().sort({ order: 1 });
      if (materii && materii.length > 0) {
        return res.json(materii);
      }
    }

    // Fallback: return mock data if database is not available
    console.log('Database not available, returning mock materii data');
    const mockMaterii = [
      { _id: '1', name: 'Matematica', description: 'Matematică', order: 1 },
      { _id: '2', name: 'Limba Romana', description: 'Limba și literatura română', order: 2 }
    ];
    res.json(mockMaterii);

  } catch (error) {
    console.error('Error fetching materii:', error);
    // Return mock data on error
    const mockMaterii = [
      { _id: '1', name: 'Matematica', description: 'Matematică', order: 1 },
      { _id: '2', name: 'Limba Romana', description: 'Limba și literatura română', order: 2 }
    ];
    res.json(mockMaterii);
  }
});

// GET single materie - PUBLIC
router.get('/materii/:id', async (req, res) => {
  try {
    const materie = await Materie.findById(req.params.id);
    if (!materie) return res.status(404).json({ error: 'Materie not found' });
    res.json(materie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CLASA ROUTES ====================
// PUBLIC ENDPOINTS - NO AUTHENTICATION REQUIRED

// GET classes for a materie - PUBLIC
router.get('/materii/:materieId/clase', async (req, res) => {
  try {
    const clase = await Clasa.find({ materieId: req.params.materieId })
      .sort({ order: 1 });
    res.json(clase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== UNITATE DE INVATARE ROUTES ====================
// PUBLIC ENDPOINTS - NO AUTHENTICATION REQUIRED

// GET units for a class - PUBLIC
router.get('/clase/:clasaId/unitati', async (req, res) => {
  try {
    const unitati = await UnitateDeInvatare.find({ clasaId: req.params.clasaId })
      .sort({ order: 1 });
    res.json(unitati);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CAPITOL ROUTES ====================
// PUBLIC ENDPOINTS - NO AUTHENTICATION REQUIRED

// GET chapters for a unit - PUBLIC
router.get('/unitati/:unitateId/capitole', async (req, res) => {
  try {
    const capitole = await Capitol.find({ unitateId: req.params.unitateId })
      .sort({ order: 1 });
    res.json(capitole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== LECTIE ROUTES ====================
// PUBLIC ENDPOINTS - NO AUTHENTICATION REQUIRED

// GET lessons for a chapter - PUBLIC
router.get('/capitole/:capitolId/lectii', async (req, res) => {
  try {
    const lectii = await Lectie.find({ capitolId: req.params.capitolId })
      .sort({ order: 1 });
    res.json(lectii);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single lectie with full details - PUBLIC
router.get('/lectii/:id', async (req, res) => {
  try {
    const lectie = await Lectie.findById(req.params.id);
    if (!lectie) return res.status(404).json({ error: 'Lectie not found' });

    const questions = await LectieQuestion.find({ lectieId: req.params.id })
      .sort({ order: 1 });

    res.json({
      ...lectie.toObject(),
      questions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER PROGRESS ROUTES ====================

// GET user progress for a lectie
router.get('/progress/lectii/:lectieId', authenticate, async (req, res) => {
  try {
    const progress = await UserProgress.findOne({
      userId: req.user.id,
      lectieId: req.params.lectieId
    });

    res.json(progress || { status: 'not-started' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all progress for user (for dashboard)
router.get('/progress/user', authenticate, async (req, res) => {
  try {
    const { clasaId, materieId } = req.query;

    let query = { userId: req.user.id };
    if (materieId) query.materieId = materieId;

    const progress = await UserProgress.find(query)
      .populate('lectieId')
      .sort({ updatedAt: -1 });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST/UPDATE user progress - save answer
router.post('/progress/save', authenticate, async (req, res) => {
  try {
    const {
      lectieId,
      questionId,
      selectedOptionIndex,
      isCorrect,
      timeSpent
    } = req.body;

    // Find or create user progress for this lectie
    let progress = await UserProgress.findOne({
      userId: req.user.id,
      lectieId
    });

    if (!progress) {
      progress = new UserProgress({
        userId: req.user.id,
        lectieId,
        lectieStatus: 'in-progress',
        attempts: 1,
        questionsAttempted: []
      });
    }

    // Add answer attempt
    progress.questionsAttempted.push({
      questionId,
      selectedOptionIndex,
      isCorrect,
      attemptNumber: (progress.questionsAttempted.length || 0) + 1
    });

    // Calculate score
    const correct = progress.questionsAttempted.filter(q => q.isCorrect).length;
    const total = progress.questionsAttempted.length;
    progress.score = Math.round((correct / total) * 100);
    progress.timeSpent = (progress.timeSpent || 0) + (timeSpent || 0);
    progress.updatedAt = new Date();

    await progress.save();

    // Update user achievements
    await updateUserAchievements(req.user.id, lectieId, isCorrect);

    res.json({
      success: true,
      progress,
      score: progress.score
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Mark lectie as completed
router.post('/progress/complete', authenticate, async (req, res) => {
  try {
    const { lectieId } = req.body;

    const progress = await UserProgress.findOne({
      userId: req.user.id,
      lectieId
    });

    if (progress) {
      progress.lectieStatus = 'completed';
      progress.completionDate = new Date();
      await progress.save();

      // Update achievements
      await updateUserAchievements(req.user.id, lectieId, true);

      res.json({ success: true, progress });
    } else {
      res.status(404).json({ error: 'Progress record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER ACHIEVEMENTS ====================

// GET user achievements
router.get('/achievements', authenticate, async (req, res) => {
  try {
    let achievement = await UserAchievement.findOne({ userId: req.user.id });

    if (!achievement) {
      achievement = new UserAchievement({ userId: req.user.id });
      await achievement.save();
    }

    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to update achievements
async function updateUserAchievements(userId, lectieId, isCorrect) {
  try {
    let achievement = await UserAchievement.findOne({ userId });

    if (!achievement) {
      achievement = new UserAchievement({ userId });
    }

    // Update statistics
    achievement.statistics.totalQuestions++;
    if (isCorrect) {
      achievement.statistics.correctAnswers++;
    }
    achievement.statistics.totalAttempts++;
    achievement.statistics.averageScore = Math.round(
      (achievement.statistics.correctAnswers / achievement.statistics.totalQuestions) * 100
    );

    // Check if lesson was completed
    const lectie = await Lectie.findById(lectieId);
    if (lectie) {
      const progress = await UserProgress.findOne({ userId, lectieId });
      if (progress && progress.lectieStatus === 'completed') {
        achievement.totalLessonsCompleted++;

        // Update subject-specific stats
        if (lectie.materieId) {
          const materie = await Materie.findById(lectie.materieId);
          if (materie) {
            const subject = materie.name === 'Matematica' ? 'matematica' : 'limbaRomana';
            achievement.statistics.bySubject[subject].lessonsCompleted++;
            achievement.statistics.bySubject[subject].averageScore =
              Math.round((achievement.statistics.correctAnswers / achievement.statistics.totalQuestions) * 100);
          }
        }

        // Award points (e.g., 10 points per lesson)
        achievement.totalPointsEarned += 10;

        // Update streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (achievement.lastActivityDate) {
          const lastActivity = new Date(achievement.lastActivityDate);
          lastActivity.setHours(0, 0, 0, 0);
          const daysDifference = (today - lastActivity) / (1000 * 60 * 60 * 24);

          if (daysDifference === 1) {
            achievement.currentStreak++;
          } else if (daysDifference > 1) {
            achievement.longestStreak = Math.max(
              achievement.currentStreak,
              achievement.longestStreak
            );
            achievement.currentStreak = 1;
          }
        } else {
          achievement.currentStreak = 1;
        }

        achievement.lastActivityDate = new Date();

        // Check for badges
        checkAndAwardBadges(achievement);
      }
    }

    achievement.updatedAt = new Date();
    await achievement.save();
  } catch (error) {
    console.error('Error updating achievements:', error);
  }
}

// Helper function to award badges
function checkAndAwardBadges(achievement) {
  const badges = [
    {
      name: 'First Lesson',
      condition: achievement.totalLessonsCompleted >= 1,
      description: 'Complete your first lesson'
    },
    {
      name: 'Week Warrior',
      condition: achievement.currentStreak >= 7,
      description: 'Complete lessons for 7 consecutive days'
    },
    {
      name: 'Month Master',
      condition: achievement.currentStreak >= 30,
      description: 'Complete lessons for 30 consecutive days'
    },
    {
      name: '100 Questions',
      condition: achievement.statistics.totalQuestions >= 100,
      description: 'Answer 100 questions'
    },
    {
      name: 'Perfect Score',
      condition: achievement.statistics.correctAnswers === achievement.statistics.totalQuestions,
      description: 'Get 100% on all answered questions'
    }
  ];

  badges.forEach(badge => {
    if (badge.condition && !achievement.badges.find(b => b.name === badge.name)) {
      achievement.badges.push({
        name: badge.name,
        earnedDate: new Date(),
        description: badge.description
      });
    }
  });
}

module.exports = router;

