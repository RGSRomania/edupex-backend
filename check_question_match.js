const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Checking question-lesson subject match...\n');
  try {
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' });
    console.log('═══════════════════════════════════════════════════════════');
    console.log('CHECKING MATEMATICA LESSONS FOR MISMATCHED QUESTIONS');
    console.log('═══════════════════════════════════════════════════════════\n');
    let matMismatched = [];
    for (const lesson of matLessons) {
      const questions = await LectieQuestion.find({ lectieId: lesson._id });
      for (const q of questions) {
        const questionText = q.question?.toLowerCase() || '';
        // Check if question is about Romanian language (not math)
        const isLimbaQuestion = questionText.includes('cuvânt') || 
                               questionText.includes('substantiv') ||
                               questionText.includes('pronunție') ||
                               questionText.includes('literă') ||
                               questionText.includes('vorbire') ||
                               questionText.includes('comunicare') ||
                               questionText.includes('ortografi');
        if (isLimbaQuestion) {
          console.log(`❌ MISMATCH: ${lesson.title}`);
          console.log(`   Question: "${q.question}"`);
          matMismatched.push({ lesson, question: q });
        }
      }
    }
    if (matMismatched.length === 0) {
      console.log('✅ No mismatches found\n');
    } else {
      console.log(`\n⚠️  Found ${matMismatched.length} mismatches\n`);
    }
    console.log('═══════════════════════════════════════════════════════════');
    console.log('CHECKING LIMBA ROMANA LESSONS FOR MISMATCHED QUESTIONS');
    console.log('═══════════════════════════════════════════════════════════\n');
    let limbaMismatched = [];
    for (const lesson of limbaLessons) {
      const questions = await LectieQuestion.find({ lectieId: lesson._id });
      for (const q of questions) {
        const questionText = q.question?.toLowerCase() || '';
        // Check if question is about math (not Romanian language)
        const isMathQuestion = questionText.includes('operație') ||
                              questionText.includes('număr') ||
                              questionText.includes('adun') ||
                              questionText.includes('scăd') ||
                              questionText.includes('înmulț') ||
                              questionText.includes('împart') ||
                              questionText.includes('calcul') ||
                              questionText.includes('sumă');
        if (isMathQuestion) {
          console.log(`❌ MISMATCH: ${lesson.title}`);
          console.log(`   Question: "${q.question}"`);
          limbaMismatched.push({ lesson, question: q });
        }
      }
    }
    if (limbaMismatched.length === 0) {
      console.log('✅ No mismatches found\n');
    } else {
      console.log(`\n⚠️  Found ${limbaMismatched.length} mismatches\n`);
    }
    console.log('═══════════════════════════════════════════════════════════');
    console.log('SUMMARY');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`Total Matematica mismatches: ${matMismatched.length}`);
    console.log(`Total Limba mismatches: ${limbaMismatched.length}`);
    console.log(`Total issues to fix: ${matMismatched.length + limbaMismatched.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
