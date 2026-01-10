const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['mathematics', 'romanian'],
  },
  gradeLevel: {
    type: Number,
    required: true,
    enum: [5, 6, 7, 8]
  },
  chapter: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  xpReward: {
    type: Number,
    default: 10
  },
  duration: { // estimated in minutes
    type: Number,
    default: 5
  },
  content: [
    {
      questionType: {
        type: String,
        required: true,
        enum: ['multipleChoice', 'fillInBlank', 'trueFalse', 'matching']
      },
      question: {
        type: String,
        required: true
      },
      options: [String],
      correctAnswer: mongoose.Schema.Types.Mixed,
      explanation: String
    }
  ],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  videoUrl: {
    type: String
  },
  hasVideo: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', LessonSchema);
