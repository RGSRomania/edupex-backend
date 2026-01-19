#!/usr/bin/env node

/**
 * DIRECT IMPORT - No fancy stuff, just import the data
 * Step by step with console output at each step
 */

const path = require('path');
const fs = require('fs');

// Load .env from the backend directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');

// Models
const { Materie, Clasa, UnitateDeInvatare, Capitol, Lectie, LectieQuestion } = require('../models/Lesson');

async function run() {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 STARTING IMPORT - STEP BY STEP');
  console.log('='.repeat(80));

  try {
    // Step 1: Connect
    console.log('\n[STEP 1] Connecting to MongoDB...');
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');

    // Step 2: Create subjects
    console.log('[STEP 2] Creating Subjects (Materii)...');
    const mat1 = await Materie.findOneAndUpdate(
      { name: 'Matematica' },
      { name: 'Matematica', description: 'Matematică', order: 1 },
      { upsert: true, new: true }
    );
    const mat2 = await Materie.findOneAndUpdate(
      { name: 'Limba Romana' },
      { name: 'Limba Romana', description: 'Limba și literatura română', order: 2 },
      { upsert: true, new: true }
    );
    console.log(`✅ Created/Updated: Matematica (${mat1._id})`);
    console.log(`✅ Created/Updated: Limba Romana (${mat2._id})\n`);

    // Step 3: Read JSON files
    console.log('[STEP 3] Reading JSON Files...');
    const jsonFiles = [
      'Matematica_Clasa_V_CORRECT.json',
      'LimbaRomana_Clasa_V_CORRECT.json'
    ];

    let totalLessons = 0;
    let totalQuestions = 0;

    for (const filename of jsonFiles) {
      const filepath = path.join(__dirname, '../../', filename);
      if (!fs.existsSync(filepath)) {
        console.log(`⚠️  File not found: ${filename}`);
        continue;
      }

      const fileData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      let { materie: materieRaw, clasa, unitati } = fileData;

      // Map subject name
      const materieMap = {
        'Matematica': 'Matematica',
        'Limba și literatura română': 'Limba Romana',
        'Limba și literatură română': 'Limba Romana',
        'Limba si literatura romana': 'Limba Romana'
      };
      const materie = materieMap[materieRaw] || materieRaw;

      const matDoc = materie === 'Matematica' ? mat1 : mat2;

      console.log(`\nProcessing: ${filename}`);
      console.log(`  Subject: ${materieRaw} → ${materie}`);
      console.log(`  Grade: ${clasa}`);
      console.log(`  Units: ${unitati.length}`);

      // Create Clasa
      let clasaDoc = await Clasa.findOne({ materieId: matDoc._id, name: clasa });
      if (!clasaDoc) {
        clasaDoc = await Clasa.create({
          materieId: matDoc._id,
          name: clasa,
          level: parseInt(clasa === 'V' ? 5 : clasa === 'VI' ? 6 : clasa === 'VII' ? 7 : 8),
          order: parseInt(clasa === 'V' ? 1 : clasa === 'VI' ? 2 : clasa === 'VII' ? 3 : 4)
        });
      }

      // Process units, chapters, lessons
      for (const unitate of unitati) {
        let unitateDoc = await UnitateDeInvatare.findOne({
          clasaId: clasaDoc._id,
          name: unitate.name
        });
        if (!unitateDoc) {
          unitateDoc = await UnitateDeInvatare.create({
            clasaId: clasaDoc._id,
            materieId: matDoc._id,
            name: unitate.name,
            descriere: unitate.descriere || '',
            order: unitate.order
          });
        }

        for (const capitol of unitate.capitole) {
          let capitolDoc = await Capitol.findOne({
            unitateId: unitateDoc._id,
            name: capitol.name
          });
          if (!capitolDoc) {
            capitolDoc = await Capitol.create({
              unitateId: unitateDoc._id,
              materieId: matDoc._id,
              name: capitol.name,
              order: capitol.order
            });
          }

          for (const lectie of capitol.lectii) {
            let lectieDoc = await Lectie.findOne({
              capitolId: capitolDoc._id,
              title: lectie.title
            });
            if (!lectieDoc) {
              lectieDoc = await Lectie.create({
                capitolId: capitolDoc._id,
                unitateId: unitateDoc._id,
                materieId: matDoc._id,
                title: lectie.title,
                summary: lectie.summary || '',
                theory: lectie.theory || '',
                examples: lectie.examples || [],
                tips: lectie.tips || [],
                order: lectie.order,
                difficulty: lectie.difficulty || 'medium',
                estimatedTime: lectie.estimatedTime || 45
              });
            }
            totalLessons++;

            if (lectie.question && lectie.question.options) {
              let qDoc = await LectieQuestion.findOne({
                lectieId: lectieDoc._id,
                question: lectie.question.text
              });
              if (!qDoc) {
                // Map JSON structure to schema structure
                const mappedOptions = lectie.question.options.map(opt => ({
                  text: opt.text,
                  isCorrect: opt.correct || false,
                  explanation: opt.explanation || ''
                }));

                await LectieQuestion.create({
                  lectieId: lectieDoc._id,
                  question: lectie.question.text,
                  options: mappedOptions,
                  order: 1
                });
              }
              totalQuestions++;
            }
          }
        }
      }

      console.log(`✅ Imported: ${filename}`);
    }

    // Step 4: Verify counts
    console.log('\n[STEP 4] Verifying Counts...');
    const lectieCount = await Lectie.countDocuments();
    const questionCount = await LectieQuestion.countDocuments();
    const unitateCount = await UnitateDeInvatare.countDocuments();
    const clasaCount = await Clasa.countDocuments();

    console.log(`✅ Lessons in database: ${lectieCount}`);
    console.log(`✅ Questions in database: ${questionCount}`);
    console.log(`✅ Units in database: ${unitateCount}`);
    console.log(`✅ Grades in database: ${clasaCount}`);

    console.log('\n' + '='.repeat(80));
    console.log('🎉 IMPORT COMPLETE!');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

run();

