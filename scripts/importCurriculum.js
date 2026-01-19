#!/usr/bin/env node

/**
 * CURRICULUM IMPORT SCRIPT
 * Imports all 8 *_CORRECT.json curriculum files into MongoDB
 *
 * Usage: node backend/scripts/importCurriculum.js
 */

const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');

// Import all models
const {
  Materie,
  Clasa,
  UnitateDeInvatare,
  Capitol,
  Lectie,
  LectieQuestion
} = require('../models/Lesson');

// Curriculum files to import
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

let stats = {
  materii: 0,
  clase: 0,
  unitati: 0,
  capitole: 0,
  lectii: 0,
  questions: 0,
  errors: []
};

// Map JSON subject names to database enum values
const subjectNameMap = {
  'Matematica': 'Matematica',
  'Limba și literatură română': 'Limba Romana',
  'Limba și literatura română': 'Limba Romana',
  'Limba si literatura romana': 'Limba Romana'
};

async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edupex';
    console.log('🔌 Connecting to MongoDB...');
    console.log('   URI:', mongoURI.substring(0, 50) + '...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function importCurriculum() {
  try {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 STARTING CURRICULUM IMPORT');
    console.log('='.repeat(80) + '\n');

    // Step 1: Create or get Materii
    console.log('📚 Step 1: Creating Materii (Subjects)...');
    const materiMap = {};

    const materii = [
      { name: 'Matematica', description: 'Matematică', order: 1 },
      { name: 'Limba Romana', description: 'Limba și literatura română', order: 2 }
    ];

    for (const materie of materii) {
      let m = await Materie.findOne({ name: materie.name });
      if (!m) {
        m = new Materie(materie);
        await m.save();
        console.log(`   ✅ Created: ${materie.name}`);
      } else {
        console.log(`   ℹ️  Exists: ${materie.name}`);
      }
      materiMap[materie.name] = m._id;
      stats.materii++;
    }

    // Step 2: Import each curriculum file
    console.log('\n📖 Step 2: Importing Curriculum Files...\n');

    for (const filename of CURRICULUM_FILES) {
      const filepath = path.join(__dirname, '../../', filename);

      if (!fs.existsSync(filepath)) {
        const error = `File not found: ${filepath}`;
        console.error(`   ❌ ${error}`);
        stats.errors.push(error);
        continue;
      }

      try {
        console.log(`   📄 Processing: ${filename}`);

        const fileData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        let { materie, clasa, unitati } = fileData;

        // Map subject name to database enum value
        materie = subjectNameMap[materie] || materie;

        // Get or create Clasa
        const materiId = materiMap[materie];
        if (!materiId) {
          throw new Error(`Unknown materie: ${materie}`);
        }

        let clasaDoc = await Clasa.findOne({ materieId: materiId, name: clasa });
        if (!clasaDoc) {
          clasaDoc = new Clasa({
            materieId: materiId,
            name: clasa,
            level: parseInt(clasa.charCodeAt(0) === 86 ? '5' : clasa), // V=5, VI=6, VII=7, VIII=8
            order: parseInt(clasa === 'V' ? 1 : clasa === 'VI' ? 2 : clasa === 'VII' ? 3 : 4)
          });
          await clasaDoc.save();
          console.log(`      ✅ Created Clasa: ${clasa}`);
        }
        stats.clase++;

        // Import Unitati, Capitole, Lectii, Questions
        for (const unitate of unitati) {
          // Create Unitate
          let unitateDoc = await UnitateDeInvatare.findOne({
            clasaId: clasaDoc._id,
            name: unitate.name
          });

          if (!unitateDoc) {
            unitateDoc = new UnitateDeInvatare({
              clasaId: clasaDoc._id,
              materieId: materiId,
              name: unitate.name,
              descriere: unitate.descriere,
              order: unitate.order
            });
            await unitateDoc.save();
          }
          stats.unitati++;

          // Process Capitole
          for (const capitol of unitate.capitole) {
            let capitolDoc = await Capitol.findOne({
              unitateId: unitateDoc._id,
              name: capitol.name
            });

            if (!capitolDoc) {
              capitolDoc = new Capitol({
                unitateId: unitateDoc._id,
                materieId: materiId,
                name: capitol.name,
                order: capitol.order
              });
              await capitolDoc.save();
            }
            stats.capitole++;

            // Process Lectii
            for (const lectie of capitol.lectii) {
              let lectieDoc = await Lectie.findOne({
                capitolId: capitolDoc._id,
                title: lectie.title
              });

              if (!lectieDoc) {
                lectieDoc = new Lectie({
                  capitolId: capitolDoc._id,
                  unitateId: unitateDoc._id,
                  materieId: materiId,
                  title: lectie.title,
                  summary: lectie.summary,
                  theory: lectie.theory || '',
                  examples: lectie.examples || [],
                  tips: lectie.tips || [],
                  order: lectie.order,
                  difficulty: lectie.difficulty || 'medium',
                  estimatedTime: lectie.estimatedTime || 45
                });
                await lectieDoc.save();
              }
              stats.lectii++;

              // Process Questions
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

                  questionDoc = new LectieQuestion({
                    lectieId: lectieDoc._id,
                    question: lectie.question.text,
                    options: mappedOptions,
                    order: 1
                  });
                  await questionDoc.save();
                }
                stats.questions++;
              }
            }
          }
        }

        console.log(`      ✅ ${materie} Clasa ${clasa} imported successfully`);

      } catch (error) {
        const errMsg = `Error importing ${filename}: ${error.message}`;
        console.error(`   ❌ ${errMsg}`);
        stats.errors.push(errMsg);
      }
    }

    // Print Summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 IMPORT SUMMARY');
    console.log('='.repeat(80) + '\n');

    console.log(`Materii created:     ${stats.materii}`);
    console.log(`Clase created:       ${stats.clase}`);
    console.log(`Unitati imported:    ${stats.unitati}`);
    console.log(`Capitole created:    ${stats.capitole}`);
    console.log(`Lectii imported:     ${stats.lectii}`);
    console.log(`Questions created:   ${stats.questions}`);

    if (stats.errors.length > 0) {
      console.log(`\nErrors: ${stats.errors.length}`);
      stats.errors.forEach(err => console.log(`  ❌ ${err}`));
    } else {
      console.log('\n✅ NO ERRORS - Import completed successfully!');
    }

    console.log('\n' + '='.repeat(80));
    console.log('🎉 CURRICULUM IMPORT COMPLETE');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB\n');
  }
}

// Run import
connectDB().then(() => importCurriculum());

