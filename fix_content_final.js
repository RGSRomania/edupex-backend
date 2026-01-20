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
    const matPath = path.join(__dirname, '../Matematica_Clasa_5_CORRECT.json');
    const limbaPath = path.join(__dirname, '../LimbaRomana_Clasa_V_CORRECT.json');
    const matData = JSON.parse(fs.readFileSync(matPath, 'utf8'));
    const limbaData = JSON.parse(fs.readFileSync(limbaPath, 'utf8'));
    const matUnitati = matData.unitati || [];
    const limbaUnitati = limbaData.unitati || [];
    // Get database lessons
    const matDbLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' }).populate('unitateId');
    const limbaDbLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' }).populate('unitateId');
    // Group by unitateId
    const matByUnitate = {};
    matDbLessons.forEach(l => {
      const unitId = l.unitateId?._id?.toString() || 'unknown';
      if (!matByUnitate[unitId]) matByUnitate[unitId] = [];
      matByUnitate[unitId].push(l);
    });
    const limbaByUnitate = {};
    limbaDbLessons.forEach(l => {
      const unitId = l.unitateId?._id?.toString() || 'unknown';
      if (!limbaByUnitate[unitId]) limbaByUnitate[unitId] = [];
      limbaByUnitate[unitId].push(l);
    });
    console.log('\n=== SAVING UPDATED CONTENT ===');
    let matUpdated = 0;
    let limbaUpdated = 0;
    // Update Matematica
    const matUnitIds = Object.keys(matByUnitate).sort();
    for (const unitId of matUnitIds) {
      const unitIndex = matUnitIds.indexOf(unitId);
      const dbLessons = matByUnitate[unitId].sort((a, b) => (a.order || 0) - (b.order || 0));
      const jsonUnitate = matUnitati[unitIndex];
      if (!jsonUnitate) continue;
      let lessonIndexInJson = 0;
      for (const capitol of (jsonUnitate.capitole || [])) {
        for (const lectieJson of (capitol.lectii || [])) {
          const dbLesson = dbLessons[lessonIndexInJson];
          if (dbLesson) {
            dbLesson.content = {
              theory: lectieJson.theory,
              examples: lectieJson.examples || [],
              tips: lectieJson.tips || []
            };
            await dbLesson.save();
            matUpdated++;
            console.log(`✅ Updated Mat: ${dbLesson.title}`);
          }
          lessonIndexInJson++;
        }
      }
    }
    // Update Limba
    const limbaUnitIds = Object.keys(limbaByUnitate).sort();
    for (const unitId of limbaUnitIds) {
      const unitIndex = limbaUnitIds.indexOf(unitId);
      const dbLessons = limbaByUnitate[unitId].sort((a, b) => (a.order || 0) - (b.order || 0));
      const jsonUnitate = limbaUnitati[unitIndex];
      if (!jsonUnitate) continue;
      let lessonIndexInJson = 0;
      for (const capitol of (jsonUnitate.capitole || [])) {
        for (const lectieJson of (capitol.lectii || [])) {
          const dbLesson = dbLessons[lessonIndexInJson];
          if (dbLesson) {
            dbLesson.content = {
              theory: lectieJson.theory,
              examples: lectieJson.examples || [],
              tips: lectieJson.tips || []
            };
            await dbLesson.save();
            limbaUpdated++;
            console.log(`✅ Updated Limba: ${dbLesson.title}`);
          }
          lessonIndexInJson++;
        }
      }
    }
    console.log(`\n✅ TOTAL UPDATED: ${matUpdated + limbaUpdated} lessons`);
    console.log(`  - Matematica: ${matUpdated} lessons`);
    console.log(`  - Limba Română: ${limbaUpdated} lessons`);
    // Verify
    console.log('\n=== VERIFICATION ===');
    const verifyMat = await Lectie.findById(matDbLessons[0]._id);
    const verifyLimba = await Lectie.findById(limbaDbLessons[0]._id);
    console.log('\nMatematica Lesson 1:');
    console.log(`  Title: ${verifyMat.title}`);
    console.log(`  Theory: ${verifyMat.content?.theory?.substring(0, 80) || 'NONE'}...`);
    console.log('\nLimba Română Lesson 1:');
    console.log(`  Title: ${verifyLimba.title}`);
    console.log(`  Theory: ${verifyLimba.content?.theory?.substring(0, 80) || 'NONE'}...`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
