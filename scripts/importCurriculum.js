#!/usr/bin/env node

/**
 * Import curriculum_structure.json into MongoDB
 * Usage: node importCurriculum.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Lesson = require('../models/Lesson');

// Get model references from Lesson file
const Materie = mongoose.model('Materie', new mongoose.Schema({}));
const Clasa = mongoose.model('Clasa', new mongoose.Schema({}));
const UnitateDeInvatare = mongoose.model('UnitateDeInvatare', new mongoose.Schema({}));
const Capitol = mongoose.model('Capitol', new mongoose.Schema({}));
const Lectie = mongoose.model('Lectie', new mongoose.Schema({}));
const LectieQuestion = mongoose.model('LectieQuestion', new mongoose.Schema({}));

const CURRICULUM_FILE = path.join(__dirname, '../../curriculum_structure.json');

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edupex', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Read curriculum file
const readCurriculumFile = () => {
  try {
    const data = fs.readFileSync(CURRICULUM_FILE, 'utf-8');
    console.log('✅ Curriculum file loaded');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error reading curriculum file:', error.message);
    process.exit(1);
  }
};

// Clear existing data
const clearDatabase = async () => {
  try {
    console.log('\n🔧 Clearing existing curriculum data...');
    await Promise.all([
      Materie.deleteMany({}),
      Clasa.deleteMany({}),
      UnitateDeInvatare.deleteMany({}),
      Capitol.deleteMany({}),
      Lectie.deleteMany({}),
      LectieQuestion.deleteMany({})
    ]);
    console.log('✅ Database cleared');
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    throw error;
  }
};

// Import curriculum data
const importCurriculum = async (curriculumData) => {
  try {
    console.log('\n📚 Importing curriculum...');

    const stats = {
      materii: 0,
      clase: 0,
      unitati: 0,
      capitole: 0,
      lectii: 0,
      intrebari: 0
    };

    // Map to store references
    const materieMap = {};
    const clasaMap = {};
    const unitateMap = {};
    const capitolMap = {};

    // Process each class
    for (const [className, classData] of Object.entries(curriculumData)) {
      if (!className.startsWith('Clasa')) continue;

      console.log(`\n  Processing ${className}...`);

      // Extract grade level from class name (e.g., "Clasa a V a" -> 5)
      const gradeLevelMatch = className.match(/a (\w+) a/);
      let gradeLevel = 0;
      if (gradeLevelMatch) {
        const romanMap = { 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8 };
        gradeLevel = romanMap[gradeLevelMatch[1]] || 0;
      }

      // Process subjects
      for (const [subjectName, units] of Object.entries(classData)) {
        if (!Array.isArray(units)) continue;

        // Get or create materie
        let materie = materieMap[subjectName];
        if (!materie) {
          const materieData = {
            name: subjectName === 'Limba și literatura romnă' ? 'Limba Romana' : 'Matematica',
            description: `${subjectName} curriculum`,
            order: subjectName === 'Limba și literatura romnă' ? 1 : 2
          };
          materie = new Materie(materieData);
          await materie.save();
          materieMap[subjectName] = materie;
          stats.materii++;
        }

        // Get or create clasa
        const clasaKey = `${className}_${subjectName}`;
        let clasa = clasaMap[clasaKey];
        if (!clasa) {
          const clasaData = {
            materieId: materie._id,
            name: ['V', 'VI', 'VII', 'VIII'][gradeLevel - 5] || 'V',
            level: gradeLevel,
            order: gradeLevel
          };
          clasa = new Clasa(clasaData);
          await clasa.save();
          clasaMap[clasaKey] = clasa;
          stats.clase++;
        }

        // Process units
        for (const unit of units) {
          const unitName = unit.name || `Unit ${unit.number}`;
          const unitKey = `${clasaKey}_${unit.number}`;

          let unitateDeInvatare = unitateMap[unitKey];
          if (!unitateDeInvatare) {
            const unitData = {
              clasaId: clasa._id,
              materieId: materie._id,
              name: unitName,
              description: `${unitName}`,
              order: parseInt(unit.number) || 0
            };
            unitateDeInvatare = new UnitateDeInvatare(unitData);
            await unitateDeInvatare.save();
            unitateMap[unitKey] = unitateDeInvatare;
            stats.unitati++;
          }

          // Create capitol (same as unit in this structure)
          const capitolData = {
            unitateId: unitateDeInvatare._id,
            clasaId: clasa._id,
            materieId: materie._id,
            name: unitName,
            description: `${unitName}`,
            order: parseInt(unit.number) || 0
          };
          const capitol = new Capitol(capitolData);
          await capitol.save();
          stats.capitole++;

          // Process lessons
          for (const lesson of unit.lectii || []) {
            const lectieData = {
              capitolId: capitol._id,
              unitateId: unitateDeInvatare._id,
              clasaId: clasa._id,
              materieId: materie._id,
              title: lesson.name || `Lesson ${lesson.number}`,
              order: parseInt(lesson.number) || 0,
              summary: lesson.summary || 'No summary available',
              content: {
                theory: lesson.summary || '',
                examples: [],
                tips: []
              },
              difficultyLevel: 'medium',
              estimatedTime: 30
            };

            const lectie = new Lectie(lectieData);
            await lectie.save();
            stats.lectii++;

            // Process questions
            for (const question of lesson.questions || []) {
              const questionData = {
                lectieId: lectie._id,
                question: question.questionText || question.question || '',
                options: (question.options || []).map((opt, idx) => ({
                  text: opt,
                  isCorrect: idx === question.correctAnswerIndex,
                  explanation: ''
                })),
                difficulty: mapDifficultyLevel(question.nivelDificultate),
                createdAt: new Date()
              };

              const lectieQuestion = new LectieQuestion(questionData);
              await lectieQuestion.save();
              stats.intrebari++;
            }
          }
        }
      }
    }

    console.log('\n✅ IMPORT COMPLETED');
    console.log('\n📊 Statistics:');
    console.log(`  • Subjects (Materii): ${stats.materii}`);
    console.log(`  • Classes (Clase): ${stats.clase}`);
    console.log(`  • Units (Unitati): ${stats.unitati}`);
    console.log(`  • Chapters (Capitole): ${stats.capitole}`);
    console.log(`  • Lessons (Lectii): ${stats.lectii}`);
    console.log(`  • Questions (Intrebari): ${stats.intrebari}`);

    return stats;
  } catch (error) {
    console.error('❌ Error importing curriculum:', error.message);
    throw error;
  }
};

// Map difficulty levels
const mapDifficultyLevel = (nivelDificultate) => {
  const map = {
    1: 'easy',
    2: 'medium',
    3: 'hard'
  };
  return map[nivelDificultate] || 'medium';
};

// Main execution
const main = async () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     IMPORTING CURRICULUM INTO MONGODB DATABASE            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    // Connect to MongoDB
    await connectDB();

    // Read curriculum file
    const curriculumData = readCurriculumFile();

    // Ask for confirmation
    console.log('\n⚠️  WARNING: This will DELETE ALL existing curriculum data!');
    console.log('Press Ctrl+C within 3 seconds to cancel...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Clear database
    await clearDatabase();

    // Import curriculum
    const stats = await importCurriculum(curriculumData);

    console.log('\n🎉 SUCCESS! Curriculum imported successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify data in MongoDB Atlas');
    console.log('2. Test API endpoints');
    console.log('3. Update frontend to load from database');

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
};

main();

