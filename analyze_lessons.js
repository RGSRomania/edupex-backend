const mongoose = require('mongoose');
const { Lectie } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' }).sort({ summary: 1 });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' }).sort({ summary: 1 });
    console.log('\n=== MATEMATICA LESSONS ===\n');
    // Count by summary
    const matSummaryCount = {};
    matLessons.forEach(lesson => {
      if (!matSummaryCount[lesson.summary]) {
        matSummaryCount[lesson.summary] = [];
      }
      matSummaryCount[lesson.summary].push({
        id: lesson._id,
        title: lesson.title,
        unit: lesson.unitateId,
        chapter: lesson.capitolId
      });
    });
    console.log('Summary of duplicates in MATEMATICA:');
    Object.entries(matSummaryCount).forEach(([summary, lessons]) => {
      console.log(`\n"${summary}"`);
      console.log(`  Count: ${lessons.length}`);
      if (lessons.length > 1) {
        lessons.forEach((l, i) => {
          console.log(`    ${i+1}. ID: ${l.id}`);
        });
      }
    });
    console.log('\n\n=== LIMBA ROMANA LESSONS ===\n');
    const limbaSummaryCount = {};
    limbaLessons.forEach(lesson => {
      if (!limbaSummaryCount[lesson.summary]) {
        limbaSummaryCount[lesson.summary] = [];
      }
      limbaSummaryCount[lesson.summary].push({
        id: lesson._id,
        title: lesson.title,
        unit: lesson.unitateId,
        chapter: lesson.capitolId
      });
    });
    console.log('Summary of duplicates in LIMBA ROMANA:');
    Object.entries(limbaSummaryCount).forEach(([summary, lessons]) => {
      console.log(`\n"${summary}"`);
      console.log(`  Count: ${lessons.length}`);
      if (lessons.length > 1) {
        lessons.forEach((l, i) => {
          console.log(`    ${i+1}. ID: ${l.id}`);
        });
      }
    });
    console.log('\n\n=== STATISTICS ===\n');
    const matDuplicates = Object.values(matSummaryCount).filter(arr => arr.length > 1).length;
    const limbaDuplicates = Object.values(limbaSummaryCount).filter(arr => arr.length > 1).length;
    console.log(`Matematica unique lessons: ${Object.keys(matSummaryCount).length}`);
    console.log(`Matematica total lessons: ${matLessons.length}`);
    console.log(`Matematica duplicated topics: ${matDuplicates}`);
    console.log(`\nLimba Romana unique lessons: ${Object.keys(limbaSummaryCount).length}`);
    console.log(`Limba Romana total lessons: ${limbaLessons.length}`);
    console.log(`Limba Romana duplicated topics: ${limbaDuplicates}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
