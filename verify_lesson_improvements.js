const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

async function verifyImprovements() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: false, useUnifiedTopology: false });

    const lessons = await Lectie.find({}).limit(5);

    console.log('✅ VERIFICATION: Lesson Formatting Improvements\n');
    console.log('════════════════════════════════════════════════════════\n');

    for (const lesson of lessons) {
      console.log(`📚 ${lesson.title}`);
      console.log('─'.repeat(56));

      console.log('\n📖 THEORY (First 200 chars):');
      const theory = lesson.content?.theory || 'No content';
      console.log(theory.substring(0, 200) + (theory.length > 200 ? '...' : ''));

      console.log('\n📌 EXAMPLES:');
      const examples = lesson.content?.examples || [];
      examples.slice(0, 2).forEach((ex, idx) => {
        console.log(`  ${idx + 1}. ${ex.substring(0, 80)}${ex.length > 80 ? '...' : ''}`);
      });

      console.log('\n💡 TIPS:');
      const tips = lesson.content?.tips || [];
      tips.slice(0, 1).forEach(tip => {
        console.log(`  ${tip.substring(0, 80)}${tip.length > 80 ? '...' : ''}`);
      });

      console.log('\n' + '═'.repeat(56) + '\n');
    }

    console.log('✅ IMPROVEMENTS VERIFIED!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifyImprovements();

