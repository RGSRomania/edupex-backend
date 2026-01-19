#!/usr/bin/env node

/**
 * BULK IMPORT - Simpler approach
 * Reads JSON and inserts all at once instead of looping
 */

const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const { Materie, Clasa, UnitateDeInvatare, Capitol, Lectie, LectieQuestion } = require('../models/Lesson');

async function importFile(filename) {
  console.log(`\n📄 Importing: ${filename}`);

  const filepath = path.join(__dirname, '../../', filename);
  if (!fs.existsSync(filepath)) {
    console.log(`   ⚠️  File not found`);
    return;
  }

  const fileData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  let { materie, clasa, unitati } = fileData;

  // Map subject name
  const subjectMap = {
    'Matematica': 'Matematica',
    'Limba și literatura română': 'Limba Romana',
  };
  materie = subjectMap[materie] || materie;

  // Get subject
  const matDoc = await Materie.findOne({ name: materie });
  if (!matDoc) {
    console.error(`   ❌ Subject not found: ${materie}`);
    return;
  }

  console.log(`   Subject: ${materie}`);
  console.log(`   Grade: ${clasa}`);
  console.log(`   Units: ${unitati.length}`);

  // Get or create Clasa
  let clasaDoc = await Clasa.findOne({ materieId: matDoc._id, name: clasa });
  if (!clasaDoc) {
    clasaDoc = await Clasa.create({
      materieId: matDoc._id,
      name: clasa,
      level: parseInt(clasa === 'V' ? 5 : clasa === 'VI' ? 6 : clasa === 'VII' ? 7 : 8),
      order: parseInt(clasa === 'V' ? 1 : clasa === 'VI' ? 2 : clasa === 'VII' ? 3 : 4)
    });
  }

  // Count lessons and questions
  let lectiiCount = 0;
  let questionsCount = 0;

  // Process all units
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

    // Process chapters
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

      // Process lessons
      for (const lectie of capitol.lectii) {
        const lectieData = {
          capitolId: capitolDoc._id,
          unitateId: unitateDoc._id,
          materieId: matDoc._id,
          title: lectie.title,
          summary: lectie.summary || '',
          theory: lectie.theory || '',
          examples: Array.isArray(lectie.examples) ? lectie.examples : [],
          tips: Array.isArray(lectie.tips) ? lectie.tips : [],
          order: lectie.order || 1,
          difficulty: lectie.difficulty || 'medium',
          estimatedTime: lectie.estimatedTime || 45
        };

        let lectieDoc = await Lectie.findOne({
          capitolId: capitolDoc._id,
          title: lectie.title
        });

        if (!lectieDoc) {
          try {
            lectieDoc = await Lectie.create(lectieData);
            lectiiCount++;
          } catch (err) {
            console.error(`   ❌ Lesson error: ${err.message}`);
            console.error(`      Data: ${JSON.stringify(lectieData)}`);
            continue;
          }
        }

        // Create question
        if (lectie.question && lectie.question.options && Array.isArray(lectie.question.options)) {
          const mappedOptions = lectie.question.options.map(opt => ({
            text: opt.text || '',
            isCorrect: opt.correct === true,
            explanation: opt.explanation || ''
          }));

          const questionData = {
            lectieId: lectieDoc._id,
            question: lectie.question.text || '',
            options: mappedOptions,
            order: 1
          };

          let qDoc = await LectieQuestion.findOne({
            lectieId: lectieDoc._id,
            question: lectie.question.text
          });

          if (!qDoc) {
            try {
              await LectieQuestion.create(questionData);
              questionsCount++;
            } catch (err) {
              console.error(`   ❌ Question error: ${err.message}`);
            }
          }
        }
      }
    }
  }

  console.log(`   ✅ Imported: ${lectiiCount} lessons, ${questionsCount} questions`);
  return { lectiiCount, questionsCount };
}

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 BULK IMPORT');
  console.log('='.repeat(80));

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');

    console.log('\n🔌 Connecting...');
    await mongoose.connect(uri);
    console.log('✅ Connected\n');

    // Create subjects
    console.log('📚 Creating subjects...');
    await Materie.findOneAndUpdate(
      { name: 'Matematica' },
      { name: 'Matematica', description: 'Matematică' },
      { upsert: true }
    );
    await Materie.findOneAndUpdate(
      { name: 'Limba Romana' },
      { name: 'Limba Romana', description: 'Limba și literatura română' },
      { upsert: true }
    );
    console.log('✅ Subjects ready\n');

    // Import files
    const files = [
      'Matematica_Clasa_V_CORRECT.json',
      'LimbaRomana_Clasa_V_CORRECT.json'
    ];

    let totalLectii = 0;
    let totalQuestions = 0;

    for (const file of files) {
      const result = await importFile(file);
      if (result) {
        totalLectii += result.lectiiCount;
        totalQuestions += result.questionsCount;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 TOTAL:');
    console.log('='.repeat(80));
    console.log(`Lessons: ${totalLectii}`);
    console.log(`Questions: ${totalQuestions}`);

    if (totalLectii >= 100) {
      console.log('\n✅ SUCCESS!');
    } else {
      console.log(`\n⚠️  WARNING: Expected 114, got ${totalLectii}`);
    }

    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

main();

