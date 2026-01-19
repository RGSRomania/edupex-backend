#!/usr/bin/env node

/**
 * FINAL IMPORT - Complete and Robust
 * No external output, just processes data
 */

const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const { Materie, Clasa, UnitateDeInvatare, Capitol, Lectie, LectieQuestion } = require('../models/Lesson');

async function importCurriculum() {
  const URI = process.env.MONGODB_URI;

  if (!URI) {
    throw new Error('MONGODB_URI not configured');
  }

  await mongoose.connect(URI, { maxPoolSize: 10 });

  // Create subjects first
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

  const subjectMap = {
    'Matematica': mat1,
    'Limba și literatura română': mat2
  };

  const files = [
    'Matematica_Clasa_V_CORRECT.json',
    'LimbaRomana_Clasa_V_CORRECT.json'
  ];

  let stats = { lectii: 0, questions: 0 };

  for (const filename of files) {
    const filepath = path.join(__dirname, '../../', filename);
    if (!fs.existsSync(filepath)) continue;

    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    const { materie: materieRaw, clasa, unitati } = data;

    const matDoc = subjectMap[materieRaw];
    if (!matDoc) continue;

    // Create clasa
    let clasaDoc = await Clasa.findOne({ materieId: matDoc._id, name: clasa });
    if (!clasaDoc) {
      clasaDoc = await Clasa.create({
        materieId: matDoc._id,
        name: clasa,
        level: clasa === 'V' ? 5 : clasa === 'VI' ? 6 : clasa === 'VII' ? 7 : 8,
        order: clasa === 'V' ? 1 : clasa === 'VI' ? 2 : clasa === 'VII' ? 3 : 4
      });
    }

    // Process all unitati
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

      // Process capitole
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

        // Process lectii
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
          stats.lectii++;

          // Add question
          if (lectie.question && lectie.question.options) {
            const qExists = await LectieQuestion.findOne({
              lectieId: lectieDoc._id,
              question: lectie.question.text
            });

            if (!qExists) {
              const mappedOpts = lectie.question.options.map(o => ({
                text: o.text,
                isCorrect: o.correct || false,
                explanation: o.explanation || ''
              }));

              await LectieQuestion.create({
                lectieId: lectieDoc._id,
                question: lectie.question.text,
                options: mappedOpts,
                order: 1
              });

              stats.questions++;
            }
          }
        }
      }
    }
  }

  await mongoose.disconnect();
  return stats;
}

// Run import
importCurriculum()
  .then(stats => {
    process.stdout.write(JSON.stringify({
      success: true,
      lectii: stats.lectii,
      questions: stats.questions
    }) + '\n');
    process.exit(0);
  })
  .catch(err => {
    process.stdout.write(JSON.stringify({
      success: false,
      error: err.message
    }) + '\n');
    process.exit(1);
  });

