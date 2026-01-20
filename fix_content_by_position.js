const mongoose = require('mongoose');
const { Lectie, UnitateDeInvatare } = require('./models/Lesson');
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
    // Extract lessons by unitate index
    const matUnitati = matData.unitati || [];
    const limbaUnitati = limbaData.unitati || [];
    console.log(`Loaded ${matUnitati.length} Mat unitati and ${limbaUnitati.length} Limba unitati`);
    // Get database lessons grouped by unitateId
    const matDbLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' }).populate('unitateId');
    const limbaDbLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' }).populate('unitateId');
    console.log(`Found ${matDbLessons.length} Mat lessons and ${limbaDbLessons.length} Limba lessons in DB`);
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
    console.log(`\nGrouped into ${Object.keys(matByUnitate).length} Mat unitati and ${Object.keys(limbaByUnitate).length} Limba unitati`);
    // Update lessons by matching position within each unitate
    console.log('\n=== UPDATING LESSONS BY POSITION ===');
    let matUpdated = 0;
    let limbaUpdated = 0;
    // Update Matematica
    const matUnitIds = Object.keys(matByUnitate).sort();
    matUnitIds.forEach((unitId, unitIndex) => {
      const dbLessons = matByUnitate[unitId].sort((a, b) => (a.order || 0) - (b.order || 0));
      const jsonUnitate = matUnitati[unitIndex];
      if (!jsonUnitate) {
        console.log(`⚠️  No JSON unitate for Mat DB unitate index ${unitIndex}`);
        return;
      }
      let lessonIndexInJson = 0;
      (jsonUnitate.capitole || []).forEach(capitol => {
        (capitol.lectii || []).forEach(lectieJson => {
          const dbLesson = dbLessons[lessonIndexInJson];
          if (dbLesson) {
            dbLesson.content = {
              theory: lectieJson.theory,
              examples: lectieJson.examples || [],
              tips: lectieJson.tips || []
            };
            // Don't await to save time, will do batch
            matUpdated++;
            console.log(`Will update Mat: ${dbLesson.title} ← ${lectieJson.title}`);
          }
          lessonIndexInJson++;
        });
      });
    });
    // Update Limba
    const limbaUnitIds = Object.keys(limbaByUnitate).sort();
    limbaUnitIds.forEach((unitId, unitIndex) => {
      const dbLessons = limbaByUnitate[unitId].sort((a, b) => (a.order || 0) - (b.order || 0));
      const jsonUnitate = limbaUnitati[unitIndex];
      if (!jsonUnitate) {
        console.log(`⚠️  No JSON unitate for Limba DB unitate index ${unitIndex}`);
        return;
      }
      let lessonIndexInJson = 0;
      (jsonUnitate.capitole || []).forEach(capitol => {
        (capitol.lectii || []).forEach(lectieJson => {
          const dbLesson = dbLessons[lessonIndexInJson];
          if (dbLesson) {
            dbLesson.content = {
              theory: lectieJson.theory,
              examples: lectieJson.examples || [],
              tips: lectieJson.tips || []
            };
            limbaUpdated++;
            console.log(`Will update Limba: ${dbLesson.title} ← ${lectieJson.title}`);
          }
          lessonIndexInJson++;
        });
      });
    });
    console.log(`\n✅ Updated ${matUpdated + limbaUpdated} lessons total`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
