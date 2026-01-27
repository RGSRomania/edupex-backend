const mongoose = require('mongoose');
require('dotenv').config();
const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);
async function analyzeLessons() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: false,
      useUnifiedTopology: false
    });
    // Find all Matematica lessons
    const lessons = await Lectie.find({ 
      curriculum: 'Matematica',
      chapter: { $exists: true }
    });
    console.log(`📊 Found ${lessons.length} Matematica lessons\n`);
    console.log('Lesson Analysis:');
    console.log('═'.repeat(80));
    lessons.forEach((lesson, i) => {
      const theoryLength = lesson.content?.theory ? lesson.content.theory.length : 0;
      const examplesCount = lesson.content?.examples ? lesson.content.examples.length : 0;
      const tipsCount = lesson.content?.tips ? lesson.content.tips.length : 0;
      // Check if theory is too long (>2000 characters = roughly 300+ words)
      const tooLong = theoryLength > 2000 ? '⚠️ LONG' : '✓ OK';
      console.log(`\n${i+1}. ${lesson.title}`);
      console.log(`   Chapter: ${lesson.chapter || 'N/A'}`);
      console.log(`   Theory: ${theoryLength} chars ${tooLong}`);
      console.log(`   Examples: ${examplesCount}`);
      console.log(`   Tips: ${tipsCount}`);
      if (lesson.content?.theory) {
        const snippet = lesson.content.theory.substring(0, 100);
        console.log(`   Preview: "${snippet}..."`);
      }
    });
    console.log('\n' + '═'.repeat(80));
    const longLessons = lessons.filter(l => (l.content?.theory?.length || 0) > 2000);
    console.log(`\n⚠️  ${longLessons.length} lessons need splitting`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}
analyzeLessons();
