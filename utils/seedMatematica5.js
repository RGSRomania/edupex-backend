#!/usr/bin/env node

/**
 * Seed Script for EduPex - Matematica Clasa 5
 *
 * This script imports all Matematica Clasa 5 lessons into the database
 *
 * Usage:
 * node backend/utils/seedMatematica5.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
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

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
console.log('Connecting to MongoDB...');
console.log('URI:', mongoURI ? mongoURI.substring(0, 50) + '...' : 'Not set');

mongoose.connect(mongoURI, {
  useNewUrlParser: false,
  useUnifiedTopology: false
}).then(() => {
  console.log('✅ Connected to MongoDB');
  seedMatematica5();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Load the JSON data
const matematica5Data = require('../Matematica_Clasa_5_Complete.json');

async function seedMatematica5() {
  try {
    console.log('\n📚 Starting to seed Matematica Clasa 5...\n');

    let materieOrder = 1;
    let clasaOrder = 1;
    let unitateOrder = 1;
    let capitolOrder = 1;
    let lectieOrder = 1;
    let questionOrder = 1;

    // Create or get Materie
    let materie = await Materie.findOne({ name: matematica5Data.materie });
    if (!materie) {
      materie = await Materie.create({
        name: matematica5Data.materie,
        order: materieOrder++
      });
      console.log(`✓ Created Materie: ${materie.name}`);
    } else {
      console.log(`✓ Using existing Materie: ${materie.name}`);
    }

    // Create or get Clasa
    let clasa = await Clasa.findOne({
      materieId: materie._id,
      name: matematica5Data.clasa
    });
    if (!clasa) {
      clasa = await Clasa.create({
        materieId: materie._id,
        name: matematica5Data.clasa,
        level: matematica5Data.level,
        order: clasaOrder++
      });
      console.log(`✓ Created Clasa: ${clasa.name}`);
    } else {
      console.log(`✓ Using existing Clasa: ${clasa.name}`);
    }

    // Process Unitati
    for (const unitatiData of matematica5Data.unitati) {
      let unitate = await UnitateDeInvatare.findOne({
        clasaId: clasa._id,
        name: unitatiData.name
      });

      if (!unitate) {
        unitate = await UnitateDeInvatare.create({
          clasaId: clasa._id,
          materieId: materie._id,
          name: unitatiData.name,
          description: unitatiData.description,
          order: unitatiData.order
        });
        console.log(`  ✓ Created Unitate: ${unitate.name}`);
      } else {
        console.log(`  ✓ Using existing Unitate: ${unitate.name}`);
      }

      // Process Capitole
      for (const capitolData of unitatiData.capitole) {
        let capitol = await Capitol.findOne({
          unitateId: unitate._id,
          name: capitolData.name
        });

        if (!capitol) {
          capitol = await Capitol.create({
            unitateId: unitate._id,
            clasaId: clasa._id,
            materieId: materie._id,
            name: capitolData.name,
            description: capitolData.description,
            order: capitolData.order
          });
          console.log(`    ✓ Created Capitol: ${capitol.name}`);
        } else {
          console.log(`    ✓ Using existing Capitol: ${capitol.name}`);
        }

        // Process Lectii
        for (const lectieData of capitolData.lectii) {
          let lectie = await Lectie.findOne({
            capitolId: capitol._id,
            title: lectieData.title
          });

          if (!lectie) {
            lectie = await Lectie.create({
              capitolId: capitol._id,
              unitateId: unitate._id,
              clasaId: clasa._id,
              materieId: materie._id,
              title: lectieData.title,
              summary: lectieData.summary,
              content: {
                theory: lectieData.theory,
                examples: lectieData.examples,
                tips: lectieData.tips
              },
              difficultyLevel: lectieData.difficulty || 'medium',
              estimatedTime: lectieData.estimatedTime,
              order: lectieData.order
            });
            console.log(`      ✓ Created Lectie: ${lectie.title}`);
          } else {
            console.log(`      ✓ Using existing Lectie: ${lectie.title}`);
          }

          // Process Questions (if provided)
          if (lectieData.questions && Array.isArray(lectieData.questions)) {
            for (const questionData of lectieData.questions) {
              const questionExists = await LectieQuestion.findOne({
                lectieId: lectie._id,
                question: questionData.question
              });

              if (!questionExists) {
                const question = await LectieQuestion.create({
                  lectieId: lectie._id,
                  question: questionData.question,
                  options: questionData.options.map((opt) => ({
                    text: opt.text,
                    isCorrect: opt.correct || false,
                    explanation: opt.explanation || ''
                  })),
                  difficulty: questionData.difficulty || 'medium',
                  order: questionOrder++
                });
                console.log(`        ✓ Created Question: "${question.question.substring(0, 50)}..."`);
              }
            }
          } else {
            console.log(`        ℹ️  No questions provided for this lesson (you can add them later)`);
          }
        }
      }
    }

    console.log('\n✅ Matematica Clasa 5 seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Materie: ${materie.name}`);
    console.log(`   - Clasa: ${clasa.name}`);
    console.log(`   - Unitati: ${matematica5Data.unitati.length}`);
    console.log(`   - Capitole: ${matematica5Data.unitati.reduce((sum, u) => sum + u.capitole.length, 0)}`);
    console.log(`   - Lectii: ${matematica5Data.unitati.reduce((sum, u) => sum + u.capitole.reduce((s, c) => s + c.lectii.length, 0), 0)}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding lessons:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

