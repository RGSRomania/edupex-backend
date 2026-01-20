#!/usr/bin/env node

/**
 * Sync the updated lesson JSON files to MongoDB
 * This uploads all the real educational content to the database
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Lectie, LectieQuestion } = require('../models/Lesson');

async function syncLessonsToDatabase() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');

    // Load the JSON files
    const mathPath = '/Users/mdica/PycharmProjects/EduPex/Matematica_Clasa_V_CORRECT.json';
    const roPath = '/Users/mdica/PycharmProjects/EduPex/LimbaRomana_Clasa_V_CORRECT.json';

    const mathData = JSON.parse(fs.readFileSync(mathPath, 'utf8'));
    const roData = JSON.parse(fs.readFileSync(roPath, 'utf8'));

    console.log('🚀 Syncing Math Class 5 lessons to database...\n');

    let mathUpdated = 0;
    let roUpdated = 0;

    // Sync Math lessons
    for (const unitate of mathData.unitati) {
      for (const capitol of unitate.capitole) {
        for (const lectie of capitol.lectii) {
          try {
            // Find the lesson in the database
            const dbLectie = await Lectie.findOne({
              title: lectie.title,
              order: lectie.order
            });

            if (dbLectie) {
              // Update lesson content
              dbLectie.summary = lectie.summary;
              dbLectie.content = {
                theory: lectie.theory,
                examples: lectie.examples,
                tips: lectie.tips
              };
              await dbLectie.save();

              // Update or create question
              let question = await LectieQuestion.findOne({ lectieId: dbLectie._id });
              if (question) {
                question.question = lectie.question.text;
                question.options = lectie.question.options.map(opt => ({
                  text: opt.text,
                  isCorrect: opt.correct,
                  explanation: opt.explanation || ''
                }));
                await question.save();
              } else {
                question = await LectieQuestion.create({
                  lectieId: dbLectie._id,
                  question: lectie.question.text,
                  options: lectie.question.options.map(opt => ({
                    text: opt.text,
                    isCorrect: opt.correct,
                    explanation: opt.explanation || ''
                  })),
                  order: 1
                });
              }

              mathUpdated++;
              console.log(`✅ Updated: ${lectie.title}`);
            } else {
              console.log(`⚠️  Not found in DB: ${lectie.title}`);
            }
          } catch (error) {
            console.error(`❌ Error updating ${lectie.title}:`, error.message);
          }
        }
      }
    }

    console.log(`\n🚀 Syncing Romanian Class 5 lessons to database...\n`);

    // Sync Romanian lessons
    for (const unitate of roData.unitati) {
      for (const capitol of unitate.capitole) {
        for (const lectie of capitol.lectii) {
          try {
            const dbLectie = await Lectie.findOne({
              title: lectie.title,
              order: lectie.order
            });

            if (dbLectie) {
              dbLectie.summary = lectie.summary;
              dbLectie.content = {
                theory: lectie.theory,
                examples: lectie.examples,
                tips: lectie.tips
              };
              await dbLectie.save();

              let question = await LectieQuestion.findOne({ lectieId: dbLectie._id });
              if (question) {
                question.question = lectie.question.text;
                question.options = lectie.question.options.map(opt => ({
                  text: opt.text,
                  isCorrect: opt.correct,
                  explanation: opt.explanation || ''
                }));
                await question.save();
              } else {
                question = await LectieQuestion.create({
                  lectieId: dbLectie._id,
                  question: lectie.question.text,
                  options: lectie.question.options.map(opt => ({
                    text: opt.text,
                    isCorrect: opt.correct,
                    explanation: opt.explanation || ''
                  })),
                  order: 1
                });
              }

              roUpdated++;
              console.log(`✅ Updated: ${lectie.title}`);
            } else {
              console.log(`⚠️  Not found in DB: ${lectie.title}`);
            }
          } catch (error) {
            console.error(`❌ Error updating ${lectie.title}:`, error.message);
          }
        }
      }
    }

    console.log(`\n✅ Successfully synced ${mathUpdated} Math lessons`);
    console.log(`✅ Successfully synced ${roUpdated} Romanian lessons`);
    console.log(`\n📊 Total lessons synced: ${mathUpdated + roUpdated}`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

syncLessonsToDatabase();

