const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

async function analyzeProblematicText() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: false, useUnifiedTopology: false });

    const lesson = await Lectie.findOne({ title: 'L5 - Lecția 5' });

    if (!lesson || !lesson.content?.theory) {
      console.log('Lesson not found');
      process.exit(0);
    }

    const theory = lesson.content.theory;
    console.log('📋 Raw text from L5:\n');
    console.log(theory);

    console.log('\n\n🔍 Character-by-character analysis of problematic section:\n');

    // Find the "nmulțire" or similar
    const searchStr = 'nmult';
    const idx = theory.indexOf(searchStr);

    if (idx >= 0) {
      console.log(`Found "${searchStr}" at position ${idx}\n`);
      console.log('Character codes:');
      for (let i = idx; i < idx + 15 && i < theory.length; i++) {
        const char = theory[i];
        const code = char.charCodeAt(0);
        const hex = code.toString(16).toUpperCase().padStart(4, '0');
        console.log(`  [${i}] '${char}' = ${code} (U+${hex})`);
      }
    } else {
      console.log('Pattern not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

analyzeProblematicText();

