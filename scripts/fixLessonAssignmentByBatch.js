#!/usr/bin/env node

/**
 * Properly fix lesson content assignment
 * Apply Math content to first set of lessons, Romanian to second set
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const { Lectie, LectieQuestion } = require('../models/Lesson');

const mathPath = '/Users/mdica/PycharmProjects/EduPex/Matematica_Clasa_V_CORRECT.json';
const roPath = '/Users/mdica/PycharmProjects/EduPex/LimbaRomana_Clasa_V_CORRECT.json';

const mathData = JSON.parse(fs.readFileSync(mathPath, 'utf8'));
const roData = JSON.parse(fs.readFileSync(roPath, 'utf8'));

// Build content maps
const mathLessons = {};
const roLessons = {};

for (const unitate of mathData.unitati) {
  for (const capitol of unitate.capitole) {
    for (const lectie of capitol.lectii) {
      const match = lectie.title.match(/L(\d+)/);
      if (match) {
        const lessonNum = match[1];
        mathLessons[lessonNum] = {
          summary: lectie.summary,
          theory: lectie.theory,
          examples: lectie.examples,
          tips: lectie.tips,
          questionText: lectie.question.text,
          options: lectie.question.options
        };
      }
    }
  }
}

for (const unitate of roData.unitati) {
  for (const capitol of unitate.capitole) {
    for (const lectie of capitol.lectii) {
      const match = lectie.title.match(/L(\d+)/);
      if (match) {
        const lessonNum = match[1];
        roLessons[lessonNum] = {
          summary: lectie.summary,
          theory: lectie.theory,
          examples: lectie.examples,
          tips: lectie.tips,
          questionText: lectie.question.text,
          options: lectie.question.options
        };
      }
    }
  }
}

async function fixLessonAssignment() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    console.log('🔧 Fixing lesson content assignment...\n');

    const allLessons = await Lectie.find().sort({ createdAt: 1 });

    // Group lessons by order - first batch is Math, second is Romanian
    const batchSize = Math.ceil(allLessons.length / 2);

    let mathFixed = 0;
    let roFixed = 0;

    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i];
      const lessonMatch = lesson.title.match(/L(\d+)/);
      if (!lessonMatch) continue;

      const lessonNum = lessonMatch[1];
      const isMathBatch = i < batchSize;

      let content;

      if (isMathBatch) {
        // First batch -> Math content
        content = mathLessons[lessonNum];
        if (content) {
          lesson.summary = content.summary;
          lesson.content = {
            theory: content.theory,
            examples: content.examples,
            tips: content.tips
          };
          await lesson.save();

          // Update question
          let question = await LectieQuestion.findOne({ lectieId: lesson._id });
          if (question) {
            question.question = content.questionText;
            question.options = content.options.map(opt => ({
              text: opt.text,
              isCorrect: opt.correct,
              explanation: opt.explanation || ''
            }));
            await question.save();
          }

          mathFixed++;
          console.log(`✅ [MATH] ${lesson.title}: ${content.summary.substring(0, 40)}...`);
        }
      } else {
        // Second batch -> Romanian content
        content = roLessons[lessonNum];
        if (content) {
          lesson.summary = content.summary;
          lesson.content = {
            theory: content.theory,
            examples: content.examples,
            tips: content.tips
          };
          await lesson.save();

          // Update question
          let question = await LectieQuestion.findOne({ lectieId: lesson._id });
          if (question) {
            question.question = content.questionText;
            question.options = content.options.map(opt => ({
              text: opt.text,
              isCorrect: opt.correct,
              explanation: opt.explanation || ''
            }));
            await question.save();
          }

          roFixed++;
          console.log(`✅ [ROMAN] ${lesson.title}: ${content.summary.substring(0, 40)}...`);
        }
      }
    }

    console.log(`\n✅ Fixed ${mathFixed} Math lessons`);
    console.log(`✅ Fixed ${roFixed} Romanian lessons`);
    console.log(`\n📊 Total: ${mathFixed + roFixed} lessons`);

    await mongoose.disconnect();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixLessonAssignment();

