const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

async function checkActualText() {
  try {
    console.log('📖 Checking actual text encoding...\n');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: false,
      useUnifiedTopology: false
    });

    const lesson = await Lectie.findOne({ title: 'L1 - Lecția 1' });

    if (lesson && lesson.content?.theory) {
      const text = lesson.content.theory;

      // Find "n a" pattern and show its bytes
      const indexOfNa = text.indexOf('n a');
      if (indexOfNa !== -1) {
        const snippet = text.substring(indexOfNa - 5, indexOfNa + 15);
        console.log('Found "n a" at position:', indexOfNa);
        console.log('Context:', JSON.stringify(snippet));
        console.log('Character codes:');
        for (let i = 0; i < Math.min(20, snippet.length); i++) {
          console.log(`  [${i}]: '${snippet[i]}' = U+${snippet.charCodeAt(i).toString(16).toUpperCase().padStart(4, '0')}`);
        }
      }

      // Check first 100 chars for pattern
      const firstHundred = text.substring(0, 100);
      console.log('\nFirst 100 characters:');
      console.log(JSON.stringify(firstHundred));
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkActualText();

