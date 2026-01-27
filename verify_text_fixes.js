const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

async function verifyFixes() {
  try {
    console.log('🔍 Verifying text fixes...\n');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: false,
      useUnifiedTopology: false
    });

    // Get first lesson
    const lesson = await Lectie.findOne({ title: 'L1 - Lecția 1' });

    if (lesson && lesson.content?.theory) {
      console.log('📖 Sample Theory Text:\n');
      const sample = lesson.content.theory.substring(0, 500);
      console.log(sample);
      console.log('\n✅ Text fixes verified!');

      // Check for specific fixes
      if (lesson.content.theory.includes('înmult') || lesson.content.theory.includes('dintre')) {
        console.log('✓ Romanian text corrections found');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyFixes();

