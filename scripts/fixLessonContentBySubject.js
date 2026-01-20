#!/usr/bin/env node

/**
 * Fix: Apply correct educational content based on subject (Math vs Romanian)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const { Lectie, LectieQuestion } = require('../models/Lesson');

// Load the JSON files to use as reference for what content goes where
const mathPath = '/Users/mdica/PycharmProjects/EduPex/Matematica_Clasa_V_CORRECT.json';
const roPath = '/Users/mdica/PycharmProjects/EduPex/LimbaRomana_Clasa_V_CORRECT.json';

const mathData = JSON.parse(fs.readFileSync(mathPath, 'utf8'));
const roData = JSON.parse(fs.readFileSync(roPath, 'utf8'));

// Create a map of lessons by lesson number
const mathContentMap = {};
const roContentMap = {};

for (const unitate of mathData.unitati) {
  for (const capitol of unitate.capitole) {
    for (const lectie of capitol.lectii) {
      const match = lectie.title.match(/L(\d+)/);
      if (match) {
        const lessonNum = `L${match[1]}`;
        mathContentMap[lessonNum] = lectie;
      }
    }
  }
}

for (const unitate of roData.unitati) {
  for (const capitol of unitate.capitole) {
    for (const lectie of capitol.lectii) {
      const match = lectie.title.match(/L(\d+)/);
      if (match) {
        const lessonNum = `L${match[1]}`;
        roContentMap[lessonNum] = lectie;
      }
    }
  }
}

async function fixLessonsContent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    console.log('🔧 Fixing lesson content based on subject...\n');

    // Get all lessons
    const allLessons = await Lectie.find().lean();
    console.log(`Found ${allLessons.length} total lessons\n`);

    let fixedMath = 0;
    let fixedRo = 0;

    for (const lesson of allLessons) {
      try {
        // Extract lesson number (L1, L2, etc.)
        const match = lesson.title.match(/L(\d+)/);
        if (!match) continue;
        const lessonNum = `L${match[1]}`;

        // Check if this is a Math or Romanian subject
        // Based on the subject ID prefixes we found: 696def9709... and 696def9809...
        const subjectId = lesson.materieId.toString();
        const isMath = subjectId.includes('696df350') || subjectId.includes('696df353') ||
                       subjectId.includes('696df354') || subjectId.includes('696df356') ||
                       subjectId.includes('696df358') || subjectId.includes('696df35a') ||
                       lesson.summary?.includes('Natural') || lesson.summary?.includes('Operații');

        let content = null;

        if (isMath && mathContentMap[lessonNum]) {
          content = mathContentMap[lessonNum];
          fixedMath++;
        } else if (!isMath && roContentMap[lessonNum]) {
          content = roContentMap[lessonNum];
          fixedRo++;
        } else {
          // Try to guess based on current content
          if (lesson.summary?.includes('comunicare') || lesson.summary?.includes('Limba')) {
            content = roContentMap[lessonNum];
            fixedRo++;
          } else if (lesson.summary?.includes('Natural') || lesson.summary?.includes('fracție')) {
            content = mathContentMap[lessonNum];
            fixedMath++;
          }
        }

        if (content) {
          // Update lesson
          await Lectie.findByIdAndUpdate(lesson._id, {
            summary: content.summary,
            content: {
              theory: content.theory,
              examples: content.examples,
              tips: content.tips
            }
          });

          // Update question
          let question = await LectieQuestion.findOne({ lectieId: lesson._id });
          if (question) {
            question.question = content.question.text;
            question.options = content.question.options.map(opt => ({
              text: opt.text,
              isCorrect: opt.correct,
              explanation: opt.explanation || ''
            }));
            await question.save();
          }

          const subjectName = isMath ? 'MATH' : 'ROMANIAN';
          console.log(`✅ ${lessonNum} [${subjectName}]: ${content.summary.substring(0, 40)}...`);
        }
      } catch (error) {
        console.error(`Error processing lesson:`, error.message);
      }
    }

    console.log(`\n✅ Fixed ${fixedMath} Math lessons`);
    console.log(`✅ Fixed ${fixedRo} Romanian lessons`);
    console.log(`\n📊 Total: ${fixedMath + fixedRo} lessons corrected`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixLessonsContent();

