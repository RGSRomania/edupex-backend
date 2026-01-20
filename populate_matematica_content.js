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
    // Load the complete Matematica JSON file
    const matPath = path.join(__dirname, '../Matematica_Clasa_5_Complete.json');
    const matData = JSON.parse(fs.readFileSync(matPath, 'utf8'));
    console.log('\n=== LOADING COMPLETE MATEMATICA CONTENT ===');
    console.log(`Loaded ${matData.unitati?.length} units`);
    // Extract all lessons with full content
    const lessonsMap = {}; // Map by title for quick lookup
    (matData.unitati || []).forEach(unitate => {
      (unitate.capitole || []).forEach(capitol => {
        (capitol.lectii || []).forEach(lectie => {
          const title = lectie.title;
          lessonsMap[title] = {
            summary: lectie.summary,
            theory: lectie.theory || '',
            examples: lectie.examples || [],
            tips: lectie.tips || []
          };
        });
      });
    });
    console.log(`Extracted ${Object.keys(lessonsMap).length} lessons with full content`);
    console.log('\nSample content:');
    const firstLessonTitle = Object.keys(lessonsMap)[0];
    console.log(`Title: ${firstLessonTitle}`);
    console.log(`Theory length: ${lessonsMap[firstLessonTitle].theory?.length || 0} chars`);
    console.log(`Examples: ${lessonsMap[firstLessonTitle].examples?.length || 0}`);
    console.log(`Tips: ${lessonsMap[firstLessonTitle].tips?.length || 0}`);
    // Get all Matematica lessons from database
    const matDbLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' }).populate('unitateId');
    console.log(`\nFound ${matDbLessons.length} Matematica lessons in DB`);
    // Try to match by title first
    console.log('\n=== MATCHING AND UPDATING LESSONS ===');
    let exactMatches = 0;
    let partialMatches = 0;
    let noMatches = 0;
    for (const dbLesson of matDbLessons) {
      const dbTitle = dbLesson.title;
      // Try exact match
      if (lessonsMap[dbTitle]) {
        dbLesson.content = lessonsMap[dbTitle];
        await dbLesson.save();
        exactMatches++;
        console.log(`✅ EXACT MATCH: ${dbTitle}`);
      } else {
        // Try to find by looking for similar titles (e.g., "L2 - ..." matching)
        const lessonNumber = dbTitle.match(/L(\d+)/)?.[1];
        if (lessonNumber) {
          const matchingContent = Object.entries(lessonsMap).find(([title]) => 
            title.includes(`L${lessonNumber} -`)
          );
          if (matchingContent) {
            dbLesson.content = matchingContent[1];
            await dbLesson.save();
            partialMatches++;
            console.log(`⚠️  PARTIAL MATCH: ${dbTitle} ← ${matchingContent[0]}`);
          } else {
            noMatches++;
            console.log(`❌ NO MATCH: ${dbTitle}`);
          }
        } else {
          noMatches++;
          console.log(`❌ NO MATCH: ${dbTitle}`);
        }
      }
    }
    console.log(`\n=== RESULTS ===`);
    console.log(`✅ Exact matches: ${exactMatches}`);
    console.log(`⚠️  Partial matches: ${partialMatches}`);
    console.log(`❌ No matches: ${noMatches}`);
    console.log(`📊 Total updated: ${exactMatches + partialMatches}/${matDbLessons.length}`);
    // Verify
    console.log('\n=== VERIFICATION ===');
    const verifyLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' }).limit(3);
    verifyLessons.forEach((lesson, i) => {
      console.log(`\nLesson ${i + 1}: ${lesson.title}`);
      console.log(`  Theory length: ${lesson.content?.theory?.length || 0} chars`);
      console.log(`  Examples: ${lesson.content?.examples?.length || 0}`);
      console.log(`  Tips: ${lesson.content?.tips?.length || 0}`);
      if (lesson.content?.theory) {
        console.log(`  Theory preview: ${lesson.content.theory.substring(0, 60)}...`);
      }
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
