#!/usr/bin/env node

/**
 * SIMPLE CURRICULUM IMPORT - MINIMAL VERSION
 * Tests each step and provides clear output
 */

const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

// Import models
const {
  Materie,
  Clasa,
  UnitateDeInvatare,
  Capitol,
  Lectie,
  LectieQuestion
} = require('../models/Lesson');

const CURRICULUM_FILES = [
  'Matematica_Clasa_V_CORRECT.json',
  'Matematica_Clasa_VI_CORRECT.json',
  'Matematica_Clasa_VII_CORRECT.json',
  'Matematica_Clasa_VIII_CORRECT.json',
  'LimbaRomana_Clasa_V_CORRECT.json',
  'LimbaRomana_Clasa_VI_CORRECT.json',
  'LimbaRomana_Clasa_VII_CORRECT.json',
  'LimbaRomana_Clasa_VIII_CORRECT.json'
];

// Subject name mapping
const subjectMap = {
  'Matematica': 'Matematica',
  'Limba și literatura română': 'Limba Romana',
  'Limba și literatura romana': 'Limba Romana',
  'Limba si literatura romana': 'Limba Romana'
};

let stats = {
  materii: 0,
  clase: 0,
  unitati: 0,
  capitole: 0,
  lectii: 0,
  questions: 0,
  errors: []
};

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 CURRICULUM IMPORT STARTED');
  console.log('='.repeat(80) + '\n');

  try {
    // Connect
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edupex';
    console.log('📌 Connecting to MongoDB...');
    await mongoose.connect(uri, { maxPoolSize: 5 });
    console.log('✅ Connected!\n');

    // Create Materii
    console.log('📚 Creating Materii...');
    const materiMap = {};

    const materii = [
      { name: 'Matematica', description: 'Matematică' },
      { name: 'Limba Romana', description: 'Limba și literatura română' }
    ];

    for (const m of materii) {
      let doc = await Materie.findOne({ name: m.name });
      if (!doc) {
        doc = await Materie.create(m);
        console.log(`   ✅ Created: ${m.name}`);
      } else {
        console.log(`   ℹ️  Exists: ${m.name}`);
      }
      materiMap[m.name] = doc._id;
    }
    stats.materii = materii.length;

    // Process each file
    console.log('\n📖 Importing Curriculum Files...\n');

    for (const filename of CURRICULUM_FILES) {
      const filepath = path.join(__dirname, '../../', filename);

      if (!fs.existsSync(filepath)) {
        console.log(`❌ NOT FOUND: ${filename}`);
        stats.errors.push(`File not found: ${filename}`);
        continue;
      }

      try {
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        let { materie, clasa, unitati } = data;

        // Map subject name
        materie = subjectMap[materie] || materie;

        const materiId = materiMap[materie];
        if (!materiId) {
          throw new Error(`Unknown materie: ${materie}`);
        }

        // Create or get Clasa
        let clasaDoc = await Clasa.findOne({ materieId: materiId, name: clasa });
        if (!clasaDoc) {
          clasaDoc = await Clasa.create({
            materieId: materiId,
            name: clasa,
            level: parseInt(clasa === 'V' ? 5 : clasa === 'VI' ? 6 : clasa === 'VII' ? 7 : 8),
            order: parseInt(clasa === 'V' ? 1 : clasa === 'VI' ? 2 : clasa === 'VII' ? 3 : 4)
          });
        }
        stats.clase++;

        // Process units
        for (const unitate of unitati) {
          let unitateDoc = await UnitateDeInvatare.findOne({
            clasaId: clasaDoc._id,
            name: unitate.name
          });

          if (!unitateDoc) {
            unitateDoc = await UnitateDeInvatare.create({
              clasaId: clasaDoc._id,
              materieId: materiId,
              name: unitate.name,
              descriere: unitate.descriere || '',
              order: unitate.order
            });
          }
          stats.unitati++;

          // Process chapters
          for (const capitol of unitate.capitole) {
            let capitolDoc = await Capitol.findOne({
              unitateId: unitateDoc._id,
              name: capitol.name
            });

            if (!capitolDoc) {
              capitolDoc = await Capitol.create({
                unitateId: unitateDoc._id,
                materieId: materiId,
                name: capitol.name,
                order: capitol.order
              });
            }
            stats.capitole++;

            // Process lessons
            for (const lectie of capitol.lectii) {
              let lectieDoc = await Lectie.findOne({
                capitolId: capitolDoc._id,
                title: lectie.title
              });

              if (!lectieDoc) {
                lectieDoc = await Lectie.create({
                  capitolId: capitolDoc._id,
                  unitateId: unitateDoc._id,
                  materieId: materiId,
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
              stats.lectii++;

              // Process question
              if (lectie.question && lectie.question.options) {
                let questionDoc = await LectieQuestion.findOne({
                  lectieId: lectieDoc._id,
                  question: lectie.question.text
                });

                if (!questionDoc) {
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
                stats.questions++;
              }
            }
          }
        }

        console.log(`✅ ${materie} Clasa ${clasa}`);

      } catch (error) {
        const msg = `Error in ${filename}: ${error.message}`;
        console.log(`❌ ${msg}`);
        stats.errors.push(msg);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80) + '\n');
    console.log(`Materii:     ${stats.materii}`);
    console.log(`Clase:       ${stats.clase}`);
    console.log(`Unitati:     ${stats.unitati}`);
    console.log(`Capitole:    ${stats.capitole}`);
    console.log(`Lectii:      ${stats.lectii}`);
    console.log(`Questions:   ${stats.questions}`);

    if (stats.errors.length > 0) {
      console.log(`\nErrors: ${stats.errors.length}`);
      stats.errors.forEach(e => console.log(`  ❌ ${e}`));
    } else {
      console.log('\n✅ SUCCESS - No errors!');
    }

    console.log('\n' + '='.repeat(80));
    console.log('🎉 IMPORT COMPLETE');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('FATAL ERROR:', error.message);
    stats.errors.push(`Fatal: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Database disconnected\n');
    process.exit(stats.errors.length > 0 ? 1 : 0);
  }
}

main();

