// Script to fix lessons with placeholder content in the database
const mongoose = require('mongoose');
require('dotenv').config();

const { Lectie, LectieQuestion } = require('../models/Lesson');

async function fixPlaceholderLessons() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');

    // Find all lessons with placeholder question text
    const placeholderLessons = await LectieQuestion.find({
      'question': /^Ce ai învățat în/
    });

    console.log(`Found ${placeholderLessons.length} lessons with placeholder questions\n`);

    if (placeholderLessons.length === 0) {
      console.log('No placeholder lessons found - database is clean!');
      await mongoose.disconnect();
      return;
    }

    // Define proper content for lessons
    const lessonContentMap = {
      'L7': {
        question: 'Care fracție este echivalentă cu 1/2?',
        options: [
          { text: '2/3', isCorrect: false },
          { text: '3/6', isCorrect: true },
          { text: '2/5', isCorrect: false },
          { text: '4/6', isCorrect: false }
        ]
      },
      'L8': {
        question: 'Cât este 1/4 ca zecimală?',
        options: [
          { text: '0,2', isCorrect: false },
          { text: '0,25', isCorrect: true },
          { text: '0,4', isCorrect: false },
          { text: '0,5', isCorrect: false }
        ]
      }
    };

    // Fix each placeholder lesson
    let fixed = 0;
    for (const placeholderQuestion of placeholderLessons) {
      try {
        // Extract lesson number from question or find from lesson
        const lectie = await Lectie.findById(placeholderQuestion.lectieId);
        if (!lectie) continue;

        const lessonMatch = lectie.title.match(/L(\d+)/);
        const lessonNum = lessonMatch ? `L${lessonMatch[1]}` : null;

        if (!lessonNum || !lessonContentMap[lessonNum]) {
          console.log(`⚠️  No replacement found for ${lessonNum}`);
          continue;
        }

        const newContent = lessonContentMap[lessonNum];

        // Update the question
        await LectieQuestion.findByIdAndUpdate(
          placeholderQuestion._id,
          {
            question: newContent.question,
            options: newContent.options
          }
        );

        console.log(`✅ Fixed ${lessonNum} (${lectie.title})`);
        fixed++;
      } catch (error) {
        console.error(`❌ Error fixing lesson:`, error.message);
      }
    }

    console.log(`\n✅ Fixed ${fixed} lessons with proper content`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixPlaceholderLessons();

