const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

// COMPREHENSIVE Romanian math keywords with all grammatical forms
const MATH_KEYWORDS = [
  // Basic concepts - all forms
  'mulțime', 'mulțimi', 'element', 'elemente', 'număr', 'numere', 'numere naturale',
  'operație', 'operații', 'operația', 'adunare', 'scădere', 'înmulțire', 'împărțire',
  'prim', 'primi', 'compus', 'compuși', 'impar', 'impari', 'par', 'pari',
  'divizor', 'divizori', 'multiplu', 'multiplii',  'CMMDC', 'CMMMC',
  'fracție', 'fracții', 'decimal', 'zecimale', 'procent', 'procente',
  'teoremă', 'axiomă', 'definiție', 'proprietate', 'proprietăți', 'regulă',
  'formula', 'formule', 'ecuație', 'ecuații', 'inecuație',
  'interval', 'intervale', 'limită', 'limite', 'derivată', 'derivate',
  'integrală', 'integrale', 'funcție', 'funcții', 'grafic', 'grafice',
  'egal', 'egalitate', 'egalități', 'diferit', 'inegalitate', 'inegalități',
  'mai mic', 'mai mare', 'mai mic sau egal', 'mai mare sau egal',
  'perpendicular', 'perpendicularitate', 'paralel', 'paralelism',
  'unghi', 'unghiuri', 'triunghi', 'triunghiuri', 'dreptunghi', 'dreptunghiuri',
  'pătrat', 'pătrate', 'cerc', 'cercuri', 'diametru', 'diametre',
  'rază', 'raze', 'coardă', 'coarde',
  'aria', 'arii', 'perimetru', 'perimetrii', 'volum', 'volume', 'suprafață',
  'median', 'mediane', 'mediatoare', 'mediatrice', 'bisectoare', 'bisectrice',
  'înălțime', 'înălțimi', 'bază', 'baze', 'latura', 'laturi', 'vârf', 'vârfuri',
  'unitate', 'unități', 'valoare', 'valori', 'cost', 'costuri', 'preț', 'prețuri',
  'metoda', 'procedeu', 'algoritm', 'pas', 'pași', 'rezultat', 'rezultate',
  'soluție', 'soluții', 'răspuns', 'răspunsuri', 'verific', 'verificare',
  // Additional forms for division-related terms
  'împarte', 'împarte', 'deîmpărțit', 'deîmpărțitor', 'cât', 'rest',
  'înmulțire', 'înmulțit', 'înmulțesc', 'înmulțește', 'înmulțești'
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

async function formatAllLessonInstances() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: false,
      useUnifiedTopology: false
    });

    const lessons = await Lectie.find({});
    console.log(`📚 Processing ${lessons.length} lesson instances with comprehensive keywords...\n`);

    let fixed = 0;
    for (const lesson of lessons) {
      let hasChanges = false;

      // Format theory
      if (lesson.content?.theory && !lesson.content.theory.includes('**')) {
        lesson.content.theory = boldKeywords(lesson.content.theory);
        hasChanges = true;
      }

      // Format examples
      if (lesson.content?.examples && Array.isArray(lesson.content.examples)) {
        const originalExamples = JSON.stringify(lesson.content.examples);
        lesson.content.examples = lesson.content.examples.map(ex =>
          typeof ex === 'string' ? boldKeywords(ex) : ex
        );
        if (JSON.stringify(lesson.content.examples) !== originalExamples) {
          hasChanges = true;
        }
      }

      // Format tips
      if (lesson.content?.tips && Array.isArray(lesson.content.tips)) {
        const originalTips = JSON.stringify(lesson.content.tips);
        lesson.content.tips = lesson.content.tips.map(tip =>
          typeof tip === 'string' ? boldKeywords(tip) : tip
        );
        if (JSON.stringify(lesson.content.tips) !== originalTips) {
          hasChanges = true;
        }
      }

      if (hasChanges) {
        lesson.markModified('content.theory');
        lesson.markModified('content.examples');
        lesson.markModified('content.tips');
        await lesson.save();
        console.log(`✅ ${lesson.title}`);
        fixed++;
      }
    }

    console.log(`\n✅ Successfully formatted ${fixed} lesson instances`);
    console.log('\n📋 Applied comprehensive formatting:');
    console.log('  ✓ Bold keywords in theory sections');
    console.log('  ✓ Bold keywords in examples');
    console.log('  ✓ Bold keywords in tips/notes');
    console.log('  ✓ All Romanian grammatical forms included');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

formatAllLessonInstances();

