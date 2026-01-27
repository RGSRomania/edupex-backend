const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

async function analyzeLessonsForSplitting() {
  try {
    console.log('📊 LESSON ANALYSIS REPORT\n');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: false,
      useUnifiedTopology: false
    });

    const lessons = await Lectie.find({});

    console.log(`Total lessons analyzed: ${lessons.length}\n`);
    console.log('═'.repeat(80));

    const stats = {
      total: lessons.length,
      withBold: 0,
      needsSplitting: 0,
      formatted: []
    };

    lessons.forEach(lesson => {
      const theoryLength = lesson.content?.theory?.length || 0;
      const hasBold = lesson.content?.theory?.includes('**');
      const examplesCount = lesson.content?.examples?.length || 0;
      const tipsCount = lesson.content?.tips?.length || 0;

      if (hasBold) stats.withBold++;
      if (theoryLength > 2000) stats.needsSplitting++;

      stats.formatted.push({
        title: lesson.title,
        theoryLength,
        hasBold,
        examplesCount,
        tipsCount
      });
    });

    console.log('\n✅ FORMATTING STATUS:');
    console.log(`  Lessons with bold keywords: ${stats.withBold}/${stats.total}`);
    console.log(`  Lessons that need splitting: ${stats.needsSplitting}`);

    console.log('\n📚 DETAILED LESSON BREAKDOWN:\n');
    stats.formatted.forEach((lesson, i) => {
      const boldStatus = lesson.hasBold ? '✅' : '❌';
      const splitStatus = lesson.theoryLength > 2000 ? '⚠️ LONG' : '✓ OK';

      console.log(`${i + 1}. ${lesson.title}`);
      console.log(`   Theory: ${lesson.theoryLength} chars ${splitStatus} ${boldStatus} Bold`);
      console.log(`   Examples: ${lesson.examplesCount} | Tips: ${lesson.tipsCount}`);
    });

    console.log('\n' + '═'.repeat(80));
    console.log('\n📋 SUMMARY:');
    console.log(`✅ ${stats.withBold} lessons have bold keywords applied`);
    if (stats.needsSplitting > 0) {
      console.log(`⚠️  ${stats.needsSplitting} lessons are too long (>2000 chars) and should be split`);
    } else {
      console.log(`✓ All lesson lengths are appropriate`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

analyzeLessonsForSplitting();

