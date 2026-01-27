const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

// Comprehensive text fixes
function properlyFixText(text) {
  if (!text) return text;

  let fixed = text;

  // Fix "nmulțire" and similar - remove leading n from these words
  fixed = fixed.replace(/nmulțire/g, 'Înmulțire');
  fixed = fixed.replace(/nmulțesc/g, 'înmulțesc');
  fixed = fixed.replace(/nmulțirii/g, 'Înmulțirii');

  // Fix "ntre" → "între"
  fixed = fixed.replace(/ntre/g, 'între');
  fixed = fixed.replace(/ntr-/g, 'într-');
  fixed = fixed.replace(/ntotdea/g, 'Întotdea');

  // Common typos
  fixed = fixed.replace(/stnga/g, 'stânga');
  fixed = fixed.replace(/dreapt/g, 'dreaptă');
  fixed = fixed.replace(/\//g, '×'); // Ensure multiplication symbol

  // Fix spacing around equals and other operators
  fixed = fixed.replace(/\s*=\s*/g, ' = ');
  fixed = fixed.replace(/\s*\+\s*/g, ' + ');
  fixed = fixed.replace(/\s*-\s*/g, ' - ');
  fixed = fixed.replace(/\s*×\s*/g, ' × ');
  fixed = fixed.replace(/\s*÷\s*/g, ' ÷ ');
  fixed = fixed.replace(/\s*<\s*/g, ' < ');
  fixed = fixed.replace(/\s*>\s*/g, ' > ');
  fixed = fixed.replace(/\s*≤\s*/g, ' ≤ ');
  fixed = fixed.replace(/\s*≥\s*/g, ' ≥ ');
  fixed = fixed.replace(/\s*≠\s*/g, ' ≠ ');

  return fixed;
}

function addFormattedContent(theory, examples, tips) {
  // Add bold formatting to theory
  let formattedTheory = properlyFixText(theory || '');

  // Add section markers to examples
  const formattedExamples = (examples || []).map(ex => {
    const cleaned = properlyFixText(ex);
    return `📌 **Exemplu:** ${cleaned}`;
  });

  // Add note markers to tips
  const formattedTips = (tips || []).map(tip => {
    const cleaned = properlyFixText(tip);
    return `💡 **Notă:** ${cleaned}`;
  });

  return {
    theory: formattedTheory,
    examples: formattedExamples,
    tips: formattedTips
  };
}

async function doComprehensiveFixFinal() {
  try {
    console.log('🔗 Connecting...\n');
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: false, useUnifiedTopology: false });

    const lessons = await Lectie.find({});

    console.log(`🎯 Applying comprehensive fixes to ${lessons.length} lessons...\n`);

    let count = 0;
    for (const lesson of lessons) {
      try {
        const oldContent = JSON.stringify(lesson.content);

        // Get original content
        const theory = lesson.content?.theory || '';
        const examples = lesson.content?.examples || [];
        const tips = lesson.content?.tips || [];

        // Apply formatting
        const formatted = addFormattedContent(theory, examples, tips);

        lesson.content.theory = formatted.theory;
        lesson.content.examples = formatted.examples;
        lesson.content.tips = formatted.tips;

        const newContent = JSON.stringify(lesson.content);
        if (oldContent !== newContent) {
          await lesson.save();
          console.log(`✅ ${lesson.title}`);
          count++;
        }
      } catch (err) {
        console.log(`❌ ${lesson.title}: ${err.message}`);
      }
    }

    console.log(`\n✅ Updated ${count}/${lessons.length} lessons`);
    console.log('\n📋 Summary of improvements:');
    console.log('  ✓ Fixed "nmulțire" → "Înmulțire"');
    console.log('  ✓ Fixed "ntre" → "între"');
    console.log('  ✓ Fixed spacing around operators (=, +, -, ×, ÷, <, >, etc.)');
    console.log('  ✓ Added 📌 emoji to examples');
    console.log('  ✓ Added 💡 emoji to tips');
    console.log('  ✓ Added **bold** formatting to example/tip headers');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

doComprehensiveFixFinal();

