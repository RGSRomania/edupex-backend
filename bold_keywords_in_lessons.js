const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

// Common Romanian math keywords to bold (comprehensive list with common forms)
const MATH_KEYWORDS = [
  // Basic concepts
  'mulțime', 'mulțimi', 'element', 'elemente', 'număr', 'numere', 'numere naturale',
  'operație', 'operații', 'adunare', 'scădere', 'înmulțire', 'împărțire',

  // Number properties
  'prim', 'primi', 'compus', 'compuși', 'impar', 'impari', 'par', 'pari',
  'divizor', 'divizori', 'multiplu', 'multiplii', 'CMMDC', 'CMMMC',

  // Fractions and decimals
  'fracție', 'fracții', 'decimal', 'zecimale', 'procent', 'procente',

  // Geometry terms
  'teoremă', 'axiomă', 'definiție', 'proprietate', 'proprietăți', 'regulă',
  'formula', 'formule', 'ecuație', 'ecuații', 'inecuație',

  // Sets and intervals
  'interval', 'intervale', 'limită', 'limite', 'derivată', 'derivate',
  'integrală', 'integrale', 'functie', 'funcții', 'grafic', 'grafice',

  // Relations
  'egal', 'egalitate', 'egalități', 'diferit', 'inegalitate', 'inegalități',
  'mai mic', 'mai mare', 'mai mic sau egal', 'mai mare sau egal',

  // Geometry shapes and elements
  'perpendicular', 'perpendicularitate', 'paralel', 'paralelism',
  'unghi', 'unghiuri', 'triunghi', 'triunghiuri', 'dreptunghi', 'dreptunghiuri',
  'pătrat', 'pătrate', 'cerc', 'cercuri', 'diametru', 'diametre',
  'rază', 'raze', 'coardă', 'coarde',

  // Area, perimeter, volume
  'aria', 'arii', 'perimetru', 'perimetrii', 'volum', 'volume', 'suprafață',

  // Triangle elements
  'median', 'mediane', 'mediatoare', 'mediatrice', 'bisectoare', 'bisectrice',
  'înălțime', 'înălțimi', 'bază', 'baze', 'latura', 'laturi', 'vârf', 'vârfuri',

  // Unit-related (common in problems)
  'unitate', 'unități', 'valoare', 'valori', 'cost', 'costuri', 'preț', 'prețuri',

  // Reductions and methods
  'metoda', 'procedeu', 'algoritm', 'pas', 'pași', 'rezultat', 'rezultate',
  'soluție', 'soluții', 'răspuns', 'răspunsuri', 'verific', 'verificare'
];

function boldKeywords(text) {
  if (!text) return text;
  let result = text;

  // Sort by length (longest first) to avoid partial replacements
  const sorted = MATH_KEYWORDS.sort((a, b) => b.length - a.length);

  sorted.forEach(keyword => {
    // Case-insensitive, word-boundary matching
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    result = result.replace(regex, `**$&**`);
  });

  return result;
}

async function formatAllLessons() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: false,
      useUnifiedTopology: false
    });

    const lessons = await Lectie.find({});
    console.log(`📚 Formatting ${lessons.length} lessons...\n`);

    let formatted = 0;
    let longLessons = [];

    for (const lesson of lessons) {
      try {
        let hasChanges = false;

        // 1. Bold keywords in theory
        if (lesson.content?.theory) {
          const original = lesson.content.theory;
          lesson.content.theory = boldKeywords(lesson.content.theory);

          if (original !== lesson.content.theory) {
            hasChanges = true;
          }

          // Track long lessons for splitting
          if (lesson.content.theory.length > 2000) {
            longLessons.push({
              title: lesson.title,
              length: lesson.content.theory.length
            });
          }
        }

        // 2. Bold keywords in examples
        if (lesson.content?.examples && Array.isArray(lesson.content.examples)) {
          const originalExamples = JSON.stringify(lesson.content.examples);
          lesson.content.examples = lesson.content.examples.map(ex => {
            if (typeof ex === 'string') {
              return boldKeywords(ex);
            }
            return ex;
          });
          if (JSON.stringify(lesson.content.examples) !== originalExamples) {
            hasChanges = true;
          }
        }

        // 3. Bold keywords in tips
        if (lesson.content?.tips && Array.isArray(lesson.content.tips)) {
          const originalTips = JSON.stringify(lesson.content.tips);
          lesson.content.tips = lesson.content.tips.map(tip => {
            if (typeof tip === 'string') {
              return boldKeywords(tip);
            }
            return tip;
          });
          if (JSON.stringify(lesson.content.tips) !== originalTips) {
            hasChanges = true;
          }
        }

        if (hasChanges) {
          // Force Mongoose to detect changes in nested arrays
          lesson.markModified('content.theory');
          lesson.markModified('content.examples');
          lesson.markModified('content.tips');

          await lesson.save();
          console.log(`✅ ${lesson.title}`);
          formatted++;
        }
      } catch (err) {
        console.log(`❌ ${lesson.title}: ${err.message}`);
      }
    }

    console.log(`\n✅ Formatted ${formatted}/${lessons.length} lessons`);

    if (longLessons.length > 0) {
      console.log(`\n⚠️  ${longLessons.length} lessons need splitting:`);
      longLessons.forEach(l => {
        console.log(`   - ${l.title} (${l.length} chars)`);
      });
    }

    console.log('\n📋 Applied formatting:');
    console.log('  ✓ Bold on math keywords in theory');
    console.log('  ✓ Bold on math keywords in examples');
    console.log('  ✓ Bold on math keywords in tips');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

formatAllLessons();

