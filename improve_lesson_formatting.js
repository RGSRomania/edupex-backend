const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

// Function to add formatting to lesson content
function formatLessonContent(theory) {
  if (!theory) return theory;

  let formatted = theory;

  // Replace common key terms with bold markdown
  const keyTerms = [
    'Metoda reducerii la unitate',
    'Reprezentarea numerelor',
    'Adunarea numerelor',
    'Scăderea numerelor',
    'nmulțirea numerelor',
    'Împărțirea numerelor',
    'Ordinea operațiilor',
    'Proprietăți',
    'Comutativitate',
    'Asociativitate',
    'Distributivitate',
    'Element neutru',
    'Factori',
    'Produs',
    'Descăzut',
    'Scăzător',
    'Rest',
    'Cât',
    'Înmulțitor',
    'Termeni',
    'Sumă',
    'Operație inversă',
    'Axioma',
    'Teoremă',
    'Definiție'
  ];

  keyTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    formatted = formatted.replace(regex, `**${term}**`);
  });

  // Fix common text issues
  formatted = formatted.replace(/nmulțire/g, 'Înmulțire');
  formatted = formatted.replace(/nmulțesc/g, 'înmulțesc');
  formatted = formatted.replace(/nmulțitor/g, 'înmulțitor');
  formatted = formatted.replace(/n /g, 'în ');
  formatted = formatted.replace(/ntr-/g, 'într-');
  formatted = formatted.replace(/î=/g, 'î = ');

  // Add proper line breaks for lists
  formatted = formatted.replace(/- /g, '\n- ');

  return formatted;
}

function createFormattedExamples(examples = []) {
  if (!examples || examples.length === 0) return [];

  return examples.map(example => {
    // Wrap example in markdown formatting
    return `**Exemplu:** ${example}`;
  });
}

function createFormattedTips(tips = []) {
  if (!tips || tips.length === 0) return [];

  return tips.map(tip => {
    // Wrap tip in markdown formatting
    return `💡 **Notă:** ${tip}`;
  });
}

async function improveLessons() {
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

    console.log(`📚 Found ${lessons.length} lessons to improve\n`);

    let updated = 0;
    let errors = 0;

    for (const lesson of lessons) {
      try {
        // Format theory content
        if (lesson.content && lesson.content.theory) {
          lesson.content.theory = formatLessonContent(lesson.content.theory);
        }

        // Format examples
        if (lesson.content && lesson.content.examples) {
          lesson.content.examples = createFormattedExamples(lesson.content.examples);
        }

        // Format tips
        if (lesson.content && lesson.content.tips) {
          lesson.content.tips = createFormattedTips(lesson.content.tips);
        }

        // Save updated lesson
        await lesson.save();
        console.log(`✅ Updated: ${lesson.title}`);
        updated++;
      } catch (error) {
        console.log(`❌ Error updating ${lesson.title}: ${error.message}`);
        errors++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors: ${errors}`);
    console.log(`\n✅ Lesson formatting complete!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

improveLessons();

