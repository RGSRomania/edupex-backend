const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

async function checkMathematicsLessons() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('❌ MONGODB_URI not found');
      process.exit(1);
    }

    await mongoose.connect(mongoURI, { useNewUrlParser: false, useUnifiedTopology: false });
    console.log('✅ Connected\n');

    // Get all Matematica lessons
    const lessons = await Lectie.find({});

    console.log(`📊 Total lessons found: ${lessons.length}\n`);

    // Show first 5 lessons with their content length
    console.log('📚 First 5 lessons:');
    lessons.slice(0, 5).forEach((lesson, idx) => {
      const theoryLength = lesson.content?.theory?.length || 0;
      console.log(`\n${idx + 1}. ${lesson.title}`);
      console.log(`   Theory length: ${theoryLength} chars`);
      console.log(`   Examples: ${lesson.content?.examples?.length || 0}`);
      console.log(`   Tips: ${lesson.content?.tips?.length || 0}`);
      if (theoryLength > 0) {
        console.log(`   Preview: ${lesson.content.theory.substring(0, 100)}...`);
      }
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkMathematicsLessons();

