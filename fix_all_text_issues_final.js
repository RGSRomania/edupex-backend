const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

// Unicode-aware text replacements
function fixAllTextIssues(text) {
  if (!text) return text;

  let fixed = text;

  // Replace all problematic patterns with correct versions
  const fixes = [
    // "nmulț" variants - MUST come before generic "n" fixes
    [/nmultă/gi, 'înmultă'],
    [/nmulți/gi, 'înmulți'],
    [/nmult/gi, 'înmult'],
    [/nmult ă/gi, 'înmultă'],
    [/nmult i/gi, 'înmulți'],
    [/nmult e/gi, 'înmulte'],

    // "ntre" → "între" (must come before generic "n" fixes)
    [/ntre/g, 'între'],
    [/ntr-/g, 'într-'],
    [/ntr /g, 'într '],

    // Generic "n " at word boundaries - should be "în "
    [/\bn a /g, 'în a '],
    [/\bn e /g, 'în e '],
    [/\bn i /g, 'în i '],
    [/\bn o /g, 'în o '],
    [/\bn u /g, 'în u '],
    [/\bn ă /g, 'în ă '],
    [/\bn â /g, 'în â '],
    [/\bn î /g, 'în î '],

    // "st" issues
    [/stnga/g, 'stânga'],
    [/stînga/g, 'stânga'],

    // "dect" → "decât"
    [/dect/g, 'decât'],

    // "Ct" → "Cât"
    [/\bCt\b/g, 'Cât'],


    // Fix spacing around operators
    [/\s*=\s*/g, ' = '],
    [/\s*\+\s*/g, ' + '],
    [/\s*-\s+/g, ' - '],
  ];

  fixes.forEach(([pattern, replacement]) => {
    fixed = fixed.replace(pattern, replacement);
  });

  return fixed;
}

async function applyFinalTextFixes() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: false,
      useUnifiedTopology: false
    });

    const lessons = await Lectie.find({});

    console.log(`📚 Applying final text fixes to ${lessons.length} lessons...\n`);

    let fixed = 0;

    for (const lesson of lessons) {
      try {
        let hasChanges = false;

        // Fix theory
        if (lesson.content?.theory) {
          const original = lesson.content.theory;
          lesson.content.theory = fixAllTextIssues(lesson.content.theory);
          if (original !== lesson.content.theory) hasChanges = true;
        }

        // Fix examples
        if (lesson.content?.examples && Array.isArray(lesson.content.examples)) {
          lesson.content.examples = lesson.content.examples.map(ex => {
            if (typeof ex === 'string') {
              return fixAllTextIssues(ex);
            }
            return ex;
          });
          hasChanges = true;
        }

        // Fix tips
        if (lesson.content?.tips && Array.isArray(lesson.content.tips)) {
          lesson.content.tips = lesson.content.tips.map(tip => {
            if (typeof tip === 'string') {
              return fixAllTextIssues(tip);
            }
            return tip;
          });
          hasChanges = true;
        }

        if (hasChanges) {
          await lesson.save();
          console.log(`✅ ${lesson.title}`);
          fixed++;
        }
      } catch (err) {
        console.log(`❌ ${lesson.title}: ${err.message}`);
      }
    }

    console.log(`\n✅ Fixed ${fixed}/${lessons.length} lessons\n`);
    console.log('📋 Applied fixes:');
    console.log('  ✓ "n a" → "în a"');
    console.log('  ✓ "nmulț" → "Înmulț"');
    console.log('  ✓ "ntre" → "între"');
    console.log('  ✓ "stnga" → "stânga"');
    console.log('  ✓ "dect" → "decât"');
    console.log('  ✓ "Ct" → "Cât"');
    console.log('  ✓ Fixed operator spacing');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

applyFinalTextFixes();

