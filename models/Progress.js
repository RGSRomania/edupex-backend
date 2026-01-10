const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  xpEarned: {
    type: Number,
    default: 0
  },
  heartsLost: {
    type: Number,
    default: 0
  },
  answers: [
    {
      questionIndex: Number,
      userAnswer: mongoose.Schema.Types.Mixed,
      correct: Boolean,
      timeSpent: Number // time in seconds
    }
  ],
  timeSpent: {
    type: Number, // total time in seconds
    default: 0
  },
  completedAt: {
    type: Date
  },
  startedAt: {
    type: Date,
    default: Date.now
  }
});

// Index to efficiently query user's progress
ProgressSchema.index({ user: 1, lesson: 1 });

module.exports = mongoose.model('Progress', ProgressSchema);
