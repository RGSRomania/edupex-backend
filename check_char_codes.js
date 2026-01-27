const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

async function checkActualCharacters() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: false, useUnifiedTopology: false });

    const lesson = await Lectie.findOne({ title: 'L5 - Lecția 5' });
    if (!lesson || !lesson.content?.theory) {
      console.log('Lesson not found');
      process.exit(0);
    }

    const theory = lesson.content.theory;
    console.log('Raw theory text:');
    console.log(theory);
    console.log('\n\nCharacter codes for "n" issues:');

    // Find problematic characters
    const problematicIndex = theory.indexOf('nmultire');
    if (problematicIndex >= 0) {
      console.log(`Found "nmultire" at index ${problematicIndex}`);
      for (let i = problematicIndex; i < problematicIndex + 20; i++) {
        const char = theory[i];
        console.log(`  [${i}] '${char}' = U+${char.charCodeAt(0).toString(16).toUpperCase()}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkActualCharacters();

