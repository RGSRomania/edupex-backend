const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

// Common Romanian math keywords to bold
const MATH_KEYWORDS = [
  'mulțime', 'element', 'număr', 'operație', 'adunare', 'scădere', 'înmulțire', 'împărțire',
  'prim', 'compus', 'impar', 'par', 'divizor', 'multiplu', 'fracție', 'decimal',
  'teoremă', 'axiomă', 'definiție', 'proprietate', 'regulă', 'formula', 'ecuație',
  'interval', 'limită', 'derivată', 'integrală', 'functie', 'grafic', 'egal',
  'diferit', 'mai mic', 'mai mare', 'perpendicular', 'paralel', 'unghi', 'triunghi',
  'pătrat', 'dreptunghi', 'cerc', 'diametru', 'rază', 'aria', 'perimetru', 'volum',
  'median', 'mediatoare', 'bisectoare', 'înălțime', 'bază', 'latura', 'vârf'
];

function boldKeywords(text) {
  if (!text) return text;
  let result = text;

  // Sort by length (longest first) to avoid partial replacements
  const sorted = MATH_KEYWORDS.sort((a, b) => b.length - a.length);

  sorted.forEach(keyword => {
    // Case-insensitive, word-boundary matching
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    result = result.replace(regex, `**${keyword}**`);
  });

  return result;
}

function formatWithHighlights(theory, examples, tips) {
  let formatted = theory;

  // Add visual separator and bold examples
  if (examples && examples.length > 0) {
    formatted += '\n\n---\n\n**📝 EXEMPLE:**\n\n';
    formatted += examples.map(ex => `> ${ex}`).join('\n\n');
  }

  // Add visual separator and bold tips
  if (tips && tips.length > 0) {
    formatted += '\n\n---\n\n**💡 OBSERVAȚII:**\n\n';
    formatted += tips.map(tip => `> ℹ️ ${tip}`).join('\n\n');
  }

  return formatted;
}

function shouldSplit(theory) {
  // Split if longer than 2000 chars (roughly 300+ words)
  return theory && theory.length > 2000;
}

function splitLongLesson(theory, title) {
  // Split by sentences or paragraphs
  const sentences = theory.match(/[^.!?]+[.!?]+/g) || [theory];
  const parts = [];
  let currentPart = '';

  sentences.forEach((sentence) => {
    if ((currentPart + sentence).length < 1000) {
      currentPart += sentence;
    } else {
      if (currentPart) parts.push(currentPart.trim());
      currentPart = sentence;
    }
  });
  if (currentPart) parts.push(currentPart.trim());

  return parts;
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
    let split = 0;

    for (const lesson of lessons) {
      try {
        let hasChanges = false;

        // Format theory with bold keywords and highlights
        if (lesson.content?.theory) {
          const original = lesson.content.theory;
          let theory = boldKeywords(lesson.content.theory);

          // Check if needs splitting
          if (shouldSplit(theory)) {
            console.log(`⚠️  ${lesson.title} - TOO LONG (${theory.length} chars), keeping as is for now`);
            // In production, we could create sub-lessons here
          } else {
            lesson.content.theory = formatWithHighlights(
              theory,
              lesson.content?.examples || [],
              lesson.content?.tips || []
            );

            if (original !== lesson.content.theory) hasChanges = true;
          }
        }

        if (hasChanges) {
          await lesson.save();
          console.log(`✅ ${lesson.title}`);
          formatted++;
        }
      } catch (err) {
        console.log(`❌ ${lesson.title}: ${err.message}`);
      }
    }

    console.log(`\n✅ Formatted ${formatted}/${lessons.length} lessons`);
    console.log('\n📋 Applied formatting:');
    console.log('  ✓ Bold on math keywords');
    console.log('  ✓ Examples highlighted with "📝 EXEMPLE:"');
    console.log('  ✓ Tips/notes highlighted with "💡 OBSERVAȚII:"');
    console.log('  ✓ Block quotes (>) for visual distinction');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

formatAllLessons();

