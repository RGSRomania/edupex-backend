const mongoose = require('mongoose');

const AIAssistantSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    enum: ['mathematics', 'romanian', 'general'],
    required: true
  },
  gradeLevel: {
    type: Number,
    enum: [5, 6, 7, 8, null],
    default: null
  },
  relatedTopic: {
    type: String
  },
  frequency: {
    type: Number,
    default: 1 // how many times this question has been asked
  },
  lastAsked: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient searching
AIAssistantSchema.index({ subject: 1, gradeLevel: 1 });
AIAssistantSchema.index({ question: 'text' });

module.exports = mongoose.model('AIAssistant', AIAssistantSchema);
