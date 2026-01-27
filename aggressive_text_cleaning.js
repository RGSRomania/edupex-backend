const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

// Aggressive text cleaning with direct character replacements
function aggressiveCleanText(text) {
  if (!text) return text;

  let cleaned = text;

  // Direct replacements for known problematic patterns
  const replacements = [
    // "n" issues - these are encoding problems
    ['nmulțire', 'Înmulțire'],
    ['nmulțesc', 'înmulțesc'],
    ['nmulțirii', 'Înmulțirii'],
    ['nmulțit', 'înmulțit'],

    // "ntre" variations
    ['ntre', 'între'],
    ['ntr-', 'într-'],

    // Other typos
    ['stnga', 'stânga'],
    ['dect ', 'decât '],
    ['dect\n', 'decât\n'],
    ['dect.', 'decât.'],
    ['Ct ', 'Cât '],
    ['Ct?', 'Cât?'],

    // Spacing fixes
    [' = ', ' = '],
    [' + ', ' + '],
    [' - ', ' - '],
  ];

  replacements.forEach(([from, to]) => {
    cleaned = cleaned.split(from).join(to);
  });

  return cleaned;
}

async function aggressiveClean() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: false, useUnifiedTopology: false });

    const lessons = await Lectie.find({});

    console.log(`🎯 Aggressive cleaning of ${lessons.length} lessons...\n`);

    let improved = 0;

    for (const lesson of lessons) {
      try {
        let changed = false;

        // Clean theory
        if (lesson.content?.theory) {
          const original = lesson.content.theory;
          lesson.content.theory = aggressiveCleanText(lesson.content.theory);
          if (original !== lesson.content.theory) {
            changed = true;
          }
        }

        // Clean examples
        if (lesson.content?.examples) {
          lesson.content.examples = lesson.content.examples.map(ex => {
            return aggressiveCleanText(ex);
          });
          changed = true;
        }

        // Clean tips
        if (lesson.content?.tips) {
          lesson.content.tips = lesson.content.tips.map(tip => {
            return aggressiveCleanText(tip);
          });
          changed = true;
        }

        if (changed) {
          await lesson.save();
          console.log(`✅ ${lesson.title}`);
          improved++;
        }
      } catch (err) {
        console.log(`❌ ${lesson.title}: ${err.message}`);
      }
    }

    console.log(`\n✅ Cleaned ${improved}/${lessons.length} lessons`);
    console.log('\n📋 Fixed issues:');
    console.log('  ✓ "nmulțire" → "Înmulțire"');
    console.log('  ✓ "ntre" → "între"');
    console.log('  ✓ "stnga" → "stânga"');
    console.log('  ✓ "dect" → "decât"');
    console.log('  ✓ "Ct" → "Cât"');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

aggressiveClean();

