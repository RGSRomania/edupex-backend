#!/usr/bin/env node

/**
 * Complete Lesson Names from Cuprins for Class 5
 * Update JSON files with proper lesson names and sync to database
 */

const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

// Real lesson names extracted from manuals
const LESSON_NAMES = {
  Matematica: {
    'L9': 'Puterea cu exponent natural a unui număr natural',
    'L10': 'Ordinea efectuării operațiilor',
    'L11': 'Divizibilitate. Criterii de divizibilitate',
    'L12': 'Numere prime și numere compuse',
    'L13': 'Descompunerea în factori primi'
  },
  'Limba și literatura română': {
    'L9': 'Redactarea unui text. Redactarea unui răspuns la o întrebare',
    'L10': 'Comunicare orală și redactare',
    'L11': 'Textul narativ și descriptiv',
    'L12': 'Textul dialogat și alte forme de expresie',
    'L13': 'Evaluare și consolidare'
  }
};

const mathPath = '/Users/mdica/PycharmProjects/EduPex/Matematica_Clasa_V_CORRECT.json';
const roPath = '/Users/mdica/PycharmProjects/EduPex/LimbaRomana_Clasa_V_CORRECT.json';

function updateJsonFile(filePath, isRoman = false) {
  console.log(`\n📝 Updating ${isRoman ? 'Romanian' : 'Math'} JSON...`);

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const subjectLessons = isRoman ? LESSON_NAMES['Limba și literatura română'] : LESSON_NAMES.Matematica;

  let updated = 0;

  for (const unitate of data.unitati) {
    for (const capitol of unitate.capitole) {
      for (const lectie of capitol.lectii) {
        const match = lectie.title.match(/L(\d+)/);
        if (match) {
          const lessonNum = `L${match[1]}`;

          // Update summary with real lesson name if we have it
          if (subjectLessons[lessonNum]) {
            lectie.summary = subjectLessons[lessonNum];
            updated++;
            console.log(`  ✅ ${lessonNum}: ${subjectLessons[lessonNum]}`);
          }
        }
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`\n✅ Updated ${updated} lessons in JSON`);
  return updated;
}

async function syncToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n✅ Connected to MongoDB\n');

    const { Lectie } = require('../models/Lesson');

    // Update Math lessons
    console.log('🔄 Syncing Math lessons to database...');
    let mathCount = 0;
    for (const [lessonKey, lessonName] of Object.entries(LESSON_NAMES.Matematica)) {
      const lessons = await Lectie.find({ title: new RegExp(`${lessonKey}`) });

      for (const lesson of lessons) {
        // Check if it looks like a math lesson (in first batch)
        const lessonDoc = await Lectie.findOne({ _id: lesson._id });

        // Update summary with the real lesson name
        lessonDoc.summary = lessonName;
        await lessonDoc.save();
        mathCount++;
        console.log(`  ✅ Updated ${lesson.title} → ${lessonName}`);
      }
    }

    console.log(`\n✅ Synced ${mathCount} Math lessons\n`);

    // Update Romanian lessons
    console.log('🔄 Syncing Romanian lessons to database...');
    let roCount = 0;
    for (const [lessonKey, lessonName] of Object.entries(LESSON_NAMES['Limba și literatura română'])) {
      const lessons = await Lectie.find({ title: new RegExp(`${lessonKey}`) });

      for (const lesson of lessons) {
        const lessonDoc = await Lectie.findOne({ _id: lesson._id });

        // Update summary with the real lesson name
        lessonDoc.summary = lessonName;
        await lessonDoc.save();
        roCount++;
        console.log(`  ✅ Updated ${lesson.title} → ${lessonName}`);
      }
    }

    console.log(`\n✅ Synced ${roCount} Romanian lessons\n`);
    console.log(`\n📊 Total updated in database: ${mathCount + roCount} lessons`);

    await mongoose.disconnect();

  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

async function main() {
  try {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  Update Lesson Names from Cuprins         ║');
    console.log('╚════════════════════════════════════════════╝\n');

    // Update JSON files
    updateJsonFile(mathPath, false);
    updateJsonFile(roPath, true);

    // Sync to database
    await syncToDatabase();

    console.log('\n✅ Complete! All lesson names updated.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

