const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

// Function to fix text issues - more comprehensive
function fixTextIssues(text) {
  if (!text) return text;

  let fixed = text;

  // Direct replacements for common issues
  // These are character encoding problems in the source

  // Fix "n" issues (missing diacritics)
  fixed = fixed.replace(/(\s)n([a-z])/g, '$1ă$2');  // n followed by letter = ă
  fixed = fixed.replace(/(\s)n([aeiouA-Z])/g, '$1î$2'); // n before vowel = î

  // More specific fixes
  fixed = fixed.replace(/nmultire/gi, 'Înmulțire');
  fixed = fixed.replace(/nmult/gi, 'Înmult');
  fixed = fixed.replace(/ntre/gi, 'între');
  fixed = fixed.replace(/ntr-/gi, 'într-');
  fixed = fixed.replace(/stnga/gi, 'stânga');
  fixed = fixed.replace(/dect\s/g, 'decât ');
  fixed = fixed.replace(/Ct\s/g, 'Cât ');
  fixed = fixed.replace(/Ct\?/g, 'Cât?');
  fixed = fixed.replace(/ncepe/gi, 'ncepe'); // keep as is for now

  return fixed;
}

async function testFix() {
  try {
    console.log('🔗 Testing text fixes...\n');

    // Test strings
    const testCases = [
      'nmultire numerelor',
      'ntre puncte',
      'stnga la dreapta',
      'Ct costa?',
      'dect mai mare'
    ];

    console.log('Test Results:');
    testCases.forEach(test => {
      const fixed = fixTextIssues(test);
      console.log(`  "${test}" → "${fixed}"`);
    });

    console.log('\n🔗 Now applying to database...\n');
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('❌ MONGODB_URI not found');
      process.exit(1);
    }

    await mongoose.connect(mongoURI, { useNewUrlParser: false, useUnifiedTopology: false });
    console.log('✅ Connected\n');

    const lessons = await Lectie.find({});

    let updated = 0;
    for (const lesson of lessons) {
      try {
        let changed = false;

        if (lesson.content?.theory) {
          const original = lesson.content.theory;
          lesson.content.theory = fixTextIssues(lesson.content.theory);
          if (original !== lesson.content.theory) changed = true;
        }

        if (lesson.content?.examples) {
          lesson.content.examples = lesson.content.examples.map(ex => {
            return fixTextIssues(ex);
          });
        }

        if (lesson.content?.tips) {
          lesson.content.tips = lesson.content.tips.map(tip => {
            return fixTextIssues(tip);
          });
        }

        if (changed || lesson.content?.examples || lesson.content?.tips) {
          await lesson.save();
          console.log(`✅ Fixed text issues in: ${lesson.title}`);
          updated++;
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }

    console.log(`\n✅ Updated ${updated} lessons`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testFix();

