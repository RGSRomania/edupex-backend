const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

// Comprehensive text correction function
function cleanText(text) {
  if (!text) return text;

  let cleaned = text;

  // Fix common character encoding issues
  // The issue is "n" should be "ă" or "î" or part of "în"

  // Fix "nmulțire" variations
  cleaned = cleaned.replace(/nmulți/gi, 'Înmulți');
  cleaned = cleaned.replace(/nmulțe/gi, 'Înmulțe');

  // Fix "n " at start (should be "î")
  cleaned = cleaned.replace(/^n /gm, 'în ');
  cleaned = cleaned.replace(/\n\s*n /g, '\n în ');

  // Fix "ntre" (should be "între")
  cleaned = cleaned.replace(/ntre/gi, 'între');

  // Fix "n-" variations
  cleaned = cleaned.replace(/n-/g, 'în');

  // Fix other common issues
  cleaned = cleaned.replace(/ntr-/g, 'într-');
  cleaned = cleaned.replace(/ntotd/gi, 'Întotdeauna');
  cleaned = cleaned.replace(/nceput/gi, 'nceput'); // keep as is

  // Fix spacing issues
  cleaned = cleaned.replace(/Ct /g, 'Cât ');
  cleaned = cleaned.replace(/Ct\?/g, 'Cât?');

  // Fix stnga/dreapta
  cleaned = cleaned.replace(/stnga/gi, 'stânga');
  cleaned = cleaned.replace(/dect /gi, 'decât ');
  cleaned = cleaned.replace(/dect\./gi, 'decât.');

  // Fix "egal" issues
  cleaned = cleaned.replace(/î=/g, 'î = ');

  return cleaned;
}

function formatWithBold(text) {
  if (!text) return text;

  let formatted = cleanText(text);

  // List of key terms to bold
  const keyTerms = [
    'Metoda reducerii la unitate',
    'Reprezentarea numerelor',
    'Compararea numerelor',
    'Ordonarea numerelor',
    'Adunarea numerelor',
    'Scăderea numerelor',
    'Înmulțirea numerelor',
    'Împărțirea numerelor',
    'Ordinea operațiilor',
    'Proprietatea comutativă',
    'Proprietatea asociativă',
    'Proprietatea distributivă',
    'Element neutru',
    'Factori',
    'Termeni',
    'Sumă',
    'Descăzut',
    'Scăzător',
    'Produs',
    'Cât',
    'Rest',
    'Operație inversă',
    'Axiomă',
    'Teoremă',
    'Definiție',
    'Semnul',
    'Cifră',
    'Număr',
    'Rotunjire',
    'Estimare',
    'Aproximare'
  ];

  keyTerms.forEach(term => {
    // Use word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    formatted = formatted.replace(regex, `**${term}**`);
  });

  return formatted;
}

async function improveFormattingV2() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('❌ MONGODB_URI not found');
      process.exit(1);
    }

    await mongoose.connect(mongoURI, { useNewUrlParser: false, useUnifiedTopology: false });
    console.log('✅ Connected\n');

    // Get all lessons
    const lessons = await Lectie.find({});

    console.log(`📚 Improving ${lessons.length} lessons (v2 - with text fixes)\n`);

    let updated = 0;
    let errors = 0;

    for (const lesson of lessons) {
      try {
        // Clean and format theory
        if (lesson.content && lesson.content.theory) {
          lesson.content.theory = formatWithBold(lesson.content.theory);
        }

        // Clean and format examples
        if (lesson.content && lesson.content.examples) {
          lesson.content.examples = lesson.content.examples.map(ex => {
            const cleaned = cleanText(ex);
            return `**📌 Exemplu:** ${cleaned}`;
          });
        }

        // Clean and format tips
        if (lesson.content && lesson.content.tips) {
          lesson.content.tips = lesson.content.tips.map(tip => {
            const cleaned = cleanText(tip);
            return `💡 **Notă:** ${cleaned}`;
          });
        }

        await lesson.save();
        console.log(`✅ Improved: ${lesson.title}`);
        updated++;
      } catch (error) {
        console.log(`❌ Error with ${lesson.title}: ${error.message}`);
        errors++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Improved: ${updated}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`\n✅ All lessons improved with proper formatting!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

improveFormattingV2();

