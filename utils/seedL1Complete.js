#!/usr/bin/env node

/**
 * Seed Matematica Clasa 5 - L1 Complete
 *
 * This script imports L1 with all 14 practice questions from the Manual
 *
 * Usage: node backend/utils/seedL1Complete.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const {
  Materie,
  Clasa,
  UnitateDeInvatare,
  Capitol,
  Lectie,
  LectieQuestion
} = require('../models/Lesson');

// Load the complete L1 data with all questions
const l1Data = require('../../Matematica_Clasa_5_L1_Complete.json');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: false,
  useUnifiedTopology: false
}).then(() => {
  console.log('✅ Connected to MongoDB\n');
  seedL1();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

async function seedL1() {
  try {
    console.log('📚 Seeding Matematica Clasa 5 - L1 with 14 Practice Questions\n');

    // Create/get Materie
    let materie = await Materie.findOne({ name: l1Data.materie });
    if (!materie) {
      materie = await Materie.create({
        name: l1Data.materie,
        order: 1
      });
      console.log(`✓ Created Materie: ${materie.name}`);
    } else {
      console.log(`✓ Using existing Materie: ${materie.name}`);
    }

    // Create/get Clasa
    let clasa = await Clasa.findOne({
      materieId: materie._id,
      name: l1Data.clasa
    });
    if (!clasa) {
      clasa = await Clasa.create({
        materieId: materie._id,
        name: l1Data.clasa,
        level: l1Data.level,
        order: 1
      });
      console.log(`✓ Created Clasa: ${clasa.name}\n`);
    } else {
      console.log(`✓ Using existing Clasa: ${clasa.name}\n`);
    }

    // Process data
    for (const unitate of l1Data.unitati) {
      // Create/get Unitate
      let unitateDb = await UnitateDeInvatare.findOne({
        clasaId: clasa._id,
        name: unitate.name
      });

      if (!unitateDb) {
        unitateDb = await UnitateDeInvatare.create({
          clasaId: clasa._id,
          materieId: materie._id,
          name: unitate.name,
          description: unitate.description,
          order: unitate.order
        });
        console.log(`  ✓ Created Unitate: ${unitateDb.name}`);
      } else {
        console.log(`  ✓ Using existing Unitate: ${unitateDb.name}`);
      }

      // Process Capitole
      for (const capitol of unitate.capitole) {
        let capitolDb = await Capitol.findOne({
          unitateId: unitateDb._id,
          name: capitol.name
        });

        if (!capitolDb) {
          capitolDb = await Capitol.create({
            unitateId: unitateDb._id,
            clasaId: clasa._id,
            materieId: materie._id,
            name: capitol.name,
            description: capitol.description,
            order: capitol.order
          });
          console.log(`    ✓ Created Capitol: ${capitolDb.name}`);
        } else {
          console.log(`    ✓ Using existing Capitol: ${capitolDb.name}`);
        }

        // Process Lectii
        for (const lectie of capitol.lectii) {
          let lectieDb = await Lectie.findOne({
            capitolId: capitolDb._id,
            title: lectie.title
          });

          if (!lectieDb) {
            lectieDb = await Lectie.create({
              capitolId: capitolDb._id,
              unitateId: unitateDb._id,
              clasaId: clasa._id,
              materieId: materie._id,
              title: lectie.title,
              summary: lectie.summary,
              content: {
                theory: lectie.theory,
                examples: lectie.examples,
                tips: lectie.tips
              },
              difficultyLevel: lectie.difficulty || 'medium',
              estimatedTime: lectie.estimatedTime,
              order: lectie.order
            });
            console.log(`      ✓ Created Lectie: ${lectieDb.title}`);
          } else {
            console.log(`      ✓ Using existing Lectie: ${lectieDb.title}`);
          }

          // Process Questions
          let questionsAdded = 0;
          if (lectie.questions && Array.isArray(lectie.questions)) {
            for (const questionData of lectie.questions) {
              const questionExists = await LectieQuestion.findOne({
                lectieId: lectieDb._id,
                question: questionData.question
              });

              if (!questionExists) {
                const question = await LectieQuestion.create({
                  lectieId: lectieDb._id,
                  question: questionData.question,
                  options: questionData.options.map((opt) => ({
                    text: opt.text,
                    isCorrect: opt.isCorrect || false,
                    explanation: opt.explanation || ''
                  })),
                  difficulty: questionData.difficulty || 'medium',
                  order: questionData.order
                });
                questionsAdded++;
              }
            }
            console.log(`        ✓ Added ${questionsAdded} questions`);
          }
        }
      }
    }

    console.log('\n✅ L1 Complete with Questions seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Materie: ${l1Data.materie}`);
    console.log(`   - Clasa: ${l1Data.clasa}`);
    console.log(`   - Lectii: 1`);
    console.log(`   - Questions per lesson: 14`);
    console.log(`   - Difficulty: Easy, Medium, Hard`);

    console.log('\n🎯 API Ready:');
    console.log(`   GET /api/lessons/lectii/{lectieId}`);
    console.log(`   Will include 14 practice questions with explanations`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding L1:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

