#!/usr/bin/env node

/**
 * ROBUST IMPORT - With detailed error handling
 * Shows exactly where it fails
 */

const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const { Materie, Clasa, UnitateDeInvatare, Capitol, Lectie, LectieQuestion } = require('../models/Lesson');

const CURRICULUM_FILES = [
  'Matematica_Clasa_V_CORRECT.json',
  'LimbaRomana_Clasa_V_CORRECT.json'
];

const subjectMap = {
  'Matematica': 'Matematica',
  'Limba și literatura română': 'Limba Romana',
};

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 ROBUST IMPORT WITH ERROR HANDLING');
  console.log('='.repeat(80) + '\n');

  let totalLessons = 0;
  let totalQuestions = 0;

  try {
    // Connect
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');

    console.log('[1] Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected\n');

    // Create subjects
    console.log('[2] Creating Subjects...');
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
    console.log('✅ Subjects created\n');

    // Process files
    console.log('[3] Processing Files...\n');

    for (let fileIdx = 0; fileIdx < CURRICULUM_FILES.length; fileIdx++) {
      const filename = CURRICULUM_FILES[fileIdx];
      const filepath = path.join(__dirname, '../../', filename);

      if (!fs.existsSync(filepath)) {
        console.log(`⚠️  SKIPPED: ${filename} (not found)`);
        continue;
      }

      try {
        console.log(`📄 ${filename}:`);

        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        let { materie: materieRaw, clasa, unitati } = data;

        materie = subjectMap[materieRaw] || materieRaw;
        const matDoc = materie === 'Matematica' ? mat1 : mat2;

        console.log(`   Subject: ${materieRaw} → ${materie}`);
        console.log(`   Grade: ${clasa}`);
        console.log(`   Units: ${unitati.length}`);

        // Create Clasa
        let clasaDoc = await Clasa.findOne({ materieId: matDoc._id, name: clasa });
        if (!clasaDoc) {
          clasaDoc = await Clasa.create({
            materieId: matDoc._id,
            name: clasa,
            level: parseInt(clasa === 'V' ? 5 : clasa === 'VI' ? 6 : clasa === 'VII' ? 7 : 8),
            order: parseInt(clasa === 'V' ? 1 : clasa === 'VI' ? 2 : clasa === 'VII' ? 3 : 4)
          });
          console.log(`   ✅ Created Clasa: ${clasa}`);
        }

        // Process units
        for (let unitIdx = 0; unitIdx < unitati.length; unitIdx++) {
          const unitate = unitati[unitIdx];

          try {
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

            // Process chapters
            for (let capIdx = 0; capIdx < unitate.capitole.length; capIdx++) {
              const capitol = unitate.capitole[capIdx];

              try {
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

                // Process lessons
                for (let lecIdx = 0; lecIdx < capitol.lectii.length; lecIdx++) {
                  const lectie = capitol.lectii[lecIdx];

                  try {
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

                    // Process question
                    try {
                      if (lectie.question && lectie.question.options) {
                        let qDoc = await LectieQuestion.findOne({
                          lectieId: lectieDoc._id,
                          question: lectie.question.text
                        });

                        if (!qDoc) {
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
                    } catch (qErr) {
                      console.error(`     ❌ Question error in L${lectie.order}: ${qErr.message}`);
                    }

                  } catch (lecErr) {
                    console.error(`     ❌ Lesson error: ${lecErr.message}`);
                    throw lecErr;
                  }
                }

              } catch (capErr) {
                console.error(`   ❌ Chapter error: ${capErr.message}`);
                throw capErr;
              }
            }

          } catch (unitErr) {
            console.error(`  ❌ Unit error: ${unitErr.message}`);
            throw unitErr;
          }
        }

        console.log(`   ✅ File imported: ${totalLessons} lessons total\n`);

      } catch (fileErr) {
        console.error(`\n❌ ERROR IN ${filename}:`);
        console.error(`   ${fileErr.message}\n`);
      }
    }

    // Summary
    console.log('='.repeat(80));
    console.log('📊 FINAL COUNTS:');
    console.log('='.repeat(80));
    console.log(`Lessons: ${totalLessons}`);
    console.log(`Questions: ${totalQuestions}`);

    if (totalLessons > 100) {
      console.log('\n✅ SUCCESS!');
    } else {
      console.log('\n⚠️  WARNING: Low lesson count - check for errors above');
    }

    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
  }
}

main();

