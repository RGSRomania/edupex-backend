// Script to fix the duplicate options question in the database
const mongoose = require('mongoose');
require('dotenv').config();

const { Lectie, LectieQuestion } = require('../models/Lesson');

async function fixDuplicateOptions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edupex');
    console.log('Connected to MongoDB');

    // Find the question with duplicate options
    const badQuestion = await LectieQuestion.findOne({
      'question': 'Care este rezultatul: 10 + 2 × 5?'
    });

    if (!badQuestion) {
      console.log('Question not found in database - may not be populated yet');
      console.log('The fix in populateLessonsWithUniqueContent.js will apply on next population');
    } else {
      console.log('Found question:', badQuestion);

      // Update the question with correct options
      const updatedQuestion = await LectieQuestion.findByIdAndUpdate(
        badQuestion._id,
        {
          $set: {
            options: [
              { text: '60', isCorrect: false },
              { text: '12', isCorrect: false },
              { text: '15', isCorrect: false },
              { text: '20', isCorrect: true }
            ]
          }
        },
        { new: true }
      );

      console.log('✅ Updated question:', updatedQuestion);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixDuplicateOptions();

