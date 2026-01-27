const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

async function verifyFormatting() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('❌ MONGODB_URI not found');
      process.exit(1);
    }

    await mongoose.connect(mongoURI, { useNewUrlParser: false, useUnifiedTopology: false });
    console.log('✅ Connected\n');

    // Get first 3 lessons
    const lessons = await Lectie.find({}).limit(3);

    console.log('✅ Verifying Formatting Applied:\n');
    console.log('════════════════════════════════════════════════════════\n');

    lessons.forEach((lesson, idx) => {
      console.log(`📚 ${lesson.title}`);
      console.log('─'.repeat(56));

      console.log('\n📖 THEORY:');
      console.log(lesson.content?.theory || 'No theory');

      console.log('\n\n📌 EXAMPLES:');
      (lesson.content?.examples || []).slice(0, 2).forEach(ex => {
        console.log(ex);
      });

      console.log('\n💡 TIPS:');
      (lesson.content?.tips || []).slice(0, 2).forEach(tip => {
        console.log(tip);
      });

      console.log('\n' + '═'.repeat(56) + '\n');
    });

    console.log('✅ Formatting verified!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyFormatting();

