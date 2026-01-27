const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

// Comprehensive text replacements with proper Unicode handling
function fixAllTextIssues(text) {
  if (!text) return text;

  let fixed = text;

  // Replace all problematic patterns with correct versions
  const fixes = [
    // Already has "î" but missing "n" - appears as "î n " in some cases
    [/î\s*n\s*a\s+/g, 'în a '],
    [/î\s*n\s*e\s+/g, 'în e '],
    [/î\s*n\s*i\s+/g, 'în i '],
    [/î\s*n\s*o\s+/g, 'în o '],
    [/î\s*n\s*u\s+/g, 'în u '],
    [/î\s*n\s*ă\s+/g, 'în ă '],

    // Direct "n " patterns - should be "în "
    [/\bn\s+a\s+/g, 'în a '],
    [/\bn\s+e\s+/g, 'în e '],
    [/\bn\s+i\s+/g, 'în i '],
    [/\bn\s+o\s+/g, 'în o '],
    [/\bn\s+u\s+/g, 'în u '],
    [/\bn\s+ă\s+/g, 'în ă '],

    // "nmulț" patterns → "înmulț"
    [/î\s*nmulț/gi, 'înmulț'],
    [/nmulț/gi, 'înmulț'],
    [/nmult[ăâî]/gi, (match) => 'înmult' + match[match.length - 1]],
    [/nmulți/gi, 'înmulți'],

    // "ntre" → "între"
    [/ntre/g, 'între'],
    [/ntr-/g, 'într-'],

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
    const before = fixed;
    fixed = fixed.replace(pattern, replacement);
    if (before !== fixed) {
      // Pattern was applied
    }
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

    console.log(`📚 Applying comprehensive text fixes to ${lessons.length} lessons...\n`);

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
    console.log('  ✓ "î n a" and "n a" → "în a"');
    console.log('  ✓ "nmulț" → "înmulț"');
    console.log('  ✓ "ntre" → "între"');
    console.log('  ✓ "stnga/stînga" → "stânga"');
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

