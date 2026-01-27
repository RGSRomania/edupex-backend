const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

async function analyzeLessonLength() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('❌ MONGODB_URI not found');
      process.exit(1);
    }

    await mongoose.connect(mongoURI, { useNewUrlParser: false, useUnifiedTopology: false });
    console.log('✅ Connected\n');

    // Get all lessons
    const lessons = await Lectie.find({});

    console.log(`📊 Analyzing ${lessons.length} lessons...\n`);
    console.log('Lesson Length Analysis:');
    console.log('════════════════════════════════════════════════════════\n');

    const lessonStats = lessons.map(lesson => {
      const theoryLength = lesson.content?.theory?.length || 0;
      const examplesLength = (lesson.content?.examples || []).reduce((sum, ex) => sum + ex.length, 0);
      const totalLength = theoryLength + examplesLength;
      const needsSplit = totalLength > 1500;

      return {
        title: lesson.title,
        theoryChars: theoryLength,
        examplesCount: lesson.content?.examples?.length || 0,
        totalChars: totalLength,
        needsSplit,
        estimatedTime: lesson.estimatedTime || 0
      };
    });

    // Sort by length
    lessonStats.sort((a, b) => b.totalChars - a.totalChars);

    // Display all lessons
    lessonStats.forEach((stat, idx) => {
      const splitIcon = stat.needsSplit ? '⚠️ ' : '✅ ';
      console.log(`${splitIcon}${stat.title}`);
      console.log(`   Total chars: ${stat.totalChars} | Theory: ${stat.theoryChars} | Examples: ${stat.examplesCount}`);
      console.log(`   Estimated time: ${stat.estimatedTime} min`);
      if (stat.needsSplit) {
        console.log(`   💡 Recommendation: SPLIT INTO MULTIPLE LESSONS`);
      }
      console.log();
    });

    // Summary
    const longLessons = lessonStats.filter(s => s.needsSplit);
    console.log('\n════════════════════════════════════════════════════════');
    console.log(`📈 Summary:`);
    console.log(`   Total lessons: ${lessonStats.length}`);
    console.log(`   Lessons needing split: ${longLessons.length}`);
    console.log(`   Average lesson length: ${Math.round(lessonStats.reduce((sum, s) => sum + s.totalChars, 0) / lessonStats.length)} chars`);

    if (longLessons.length > 0) {
      console.log(`\n⚠️ Lessons that should be split:`);
      longLessons.forEach(lesson => {
        console.log(`   - ${lesson.title} (${lesson.totalChars} chars)`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

analyzeLessonLength();

