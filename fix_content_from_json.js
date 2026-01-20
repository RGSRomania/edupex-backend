const mongoose = require('mongoose');
const { Lectie } = require('./models/Lesson');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  try {
    // Load JSON files
    console.log('\n=== LOADING JSON FILES ===');
    const matPath = path.join(__dirname, '../Matematica_Clasa_5_CORRECT.json');
    const limbaPath = path.join(__dirname, '../LimbaRomana_Clasa_V_CORRECT.json');
    const matData = JSON.parse(fs.readFileSync(matPath, 'utf8'));
    const limbaData = JSON.parse(fs.readFileSync(limbaPath, 'utf8'));
    console.log(`Loaded Matematica data with ${matData.unitati?.length || 0} units`);
    console.log(`Loaded Limba Română data with ${limbaData.unitati?.length || 0} units`);
    // Extract all lessons with their correct content
    console.log('\n=== EXTRACTING LESSONS FROM JSON ===');
    const matLessonsMap = {}; // Map by title for quick lookup
    const limbaLessonsMap = {};
    // Extract from Matematica
    (matData.unitati || []).forEach(unitate => {
      (unitate.capitole || []).forEach(capitol => {
        (capitol.lectii || []).forEach(lectie => {
          const title = lectie.title;
          matLessonsMap[title] = {
            summary: lectie.summary,
            theory: lectie.theory,
            examples: lectie.examples || [],
            tips: lectie.tips || []
          };
        });
      });
    });
    // Extract from Limba Română
    (limbaData.unitati || []).forEach(unitate => {
      (unitate.capitole || []).forEach(capitol => {
        (capitol.lectii || []).forEach(lectie => {
          const title = lectie.title;
          limbaLessonsMap[title] = {
            summary: lectie.summary,
            theory: lectie.theory,
            examples: lectie.examples || [],
            tips: lectie.tips || []
          };
        });
      });
    });
    console.log(`Extracted ${Object.keys(matLessonsMap).length} Matematica lessons`);
    console.log(`Extracted ${Object.keys(limbaLessonsMap).length} Limba Română lessons`);
    // Now update database lessons
    console.log('\n=== UPDATING DATABASE WITH CORRECT CONTENT ===');
    const matDbLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' });
    const limbaDbLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' });
    let matUpdated = 0;
    let limbaUpdated = 0;
    for (const lesson of matDbLessons) {
      const correctContent = matLessonsMap[lesson.title];
      if (correctContent) {
        lesson.content = correctContent;
        await lesson.save();
        matUpdated++;
        console.log(`Updated Mat Lesson: ${lesson.title}`);
      } else {
        console.log(`⚠️  No matching content for Mat Lesson: ${lesson.title}`);
      }
    }
    for (const lesson of limbaDbLessons) {
      const correctContent = limbaLessonsMap[lesson.title];
      if (correctContent) {
        lesson.content = correctContent;
        await lesson.save();
        limbaUpdated++;
        console.log(`Updated Limba Lesson: ${lesson.title}`);
      } else {
        console.log(`⚠️  No matching content for Limba Lesson: ${lesson.title}`);
      }
    }
    console.log(`\n✅ Updated ${matUpdated} Matematica lessons`);
    console.log(`✅ Updated ${limbaUpdated} Limba Română lessons`);
    // Verify
    console.log('\n=== VERIFICATION ===');
    const verifyMat = matDbLessons[0];
    const verifyLimba = limbaDbLessons[0];
    console.log('\nMatematica Lesson 1:');
    console.log(`  Title: ${verifyMat.title}`);
    console.log(`  Theory: ${verifyMat.content?.theory?.substring(0, 70) || 'NONE'}...`);
    console.log('\nLimba Română Lesson 1:');
    console.log(`  Title: ${verifyLimba.title}`);
    console.log(`  Theory: ${verifyLimba.content?.theory?.substring(0, 70) || 'NONE'}...`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
