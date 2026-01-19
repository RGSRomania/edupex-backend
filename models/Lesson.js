const mongoose = require('mongoose');

// ==================== MATERIE (SUBJECT) ====================
const MaterieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Matematica', 'Limba Romana']
  },
  description: String,
  icon: String,
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

// ==================== CLASA (GRADE) ====================
const ClasaSchema = new mongoose.Schema({
  materieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Materie',
    required: true
  },
  name: {
    type: String,
    required: true,
    enum: ['V', 'VI', 'VII', 'VIII']
  },
  level: {
    type: Number,
    required: true
  },
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

// ==================== UNITATE DE INVATARE ====================
const UnitateDeInvatareSchema = new mongoose.Schema({
  clasaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clasa',
    required: true
  },
  materieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Materie',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

// ==================== CAPITOL ====================
const CapitolSchema = new mongoose.Schema({
  unitateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UnitateDeInvatare',
    required: true
  },
  clasaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clasa'
  },
  materieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Materie'
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

// ==================== LECTIE ====================
const LectieSchema = new mongoose.Schema({
  capitolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Capitol',
    required: true
  },
  unitateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UnitateDeInvatare'
  },
  clasaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clasa'
  },
  materieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Materie'
  },
  title: {
    type: String,
    required: true
  },
  order: Number,
  summary: {
    type: String,
    required: true
  },
  content: {
    theory: String,
    examples: [String],
    tips: [String]
  },
  difficultyLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  estimatedTime: Number, // in minutes
  createdAt: { type: Date, default: Date.now }
});

// ==================== LECTIE QUESTION ====================
const LectieQuestionSchema = new mongoose.Schema({
  lectieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lectie',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [
    {
      text: {
        type: String,
        required: true
      },
      isCorrect: {
        type: Boolean,
        default: false
      },
      explanation: String
    }
  ],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  order: Number,
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false'],
    default: 'multiple-choice'
  },
  createdAt: { type: Date, default: Date.now }
});

// ==================== USER PROGRESS ====================
const UserProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lectieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lectie',
    required: true
  },
  questionsAttempted: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LectieQuestion'
      },
      selectedOptionIndex: Number,
      isCorrect: Boolean,
      timestamp: { type: Date, default: Date.now },
      attemptNumber: Number
    }
  ],
  lectieStatus: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  completionDate: Date,
  score: Number, // Percentage: 0-100
  timeSpent: Number, // in seconds
  attempts: Number,
  updatedAt: { type: Date, default: Date.now }
});

// ==================== USER ACHIEVEMENTS ====================
const UserAchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActivityDate: Date,
  totalLessonsCompleted: {
    type: Number,
    default: 0
  },
  totalPointsEarned: {
    type: Number,
    default: 0
  },
  badges: [
    {
      name: String,
      earnedDate: Date,
      description: String
    }
  ],
  statistics: {
    totalAttempts: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    bySubject: {
      matematica: {
        lessonsCompleted: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 }
      },
      limbaRomana: {
        lessonsCompleted: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 }
      }
    }
  },
  updatedAt: { type: Date, default: Date.now }
});

// Export models
module.exports = {
  Materie: mongoose.model('Materie', MaterieSchema),
  Clasa: mongoose.model('Clasa', ClasaSchema),
  UnitateDeInvatare: mongoose.model('UnitateDeInvatare', UnitateDeInvatareSchema),
  Capitol: mongoose.model('Capitol', CapitolSchema),
  Lectie: mongoose.model('Lectie', LectieSchema),
  LectieQuestion: mongoose.model('LectieQuestion', LectieQuestionSchema),
  UserProgress: mongoose.model('UserProgress', UserProgressSchema),
  UserAchievement: mongoose.model('UserAchievement', UserAchievementSchema)
};

