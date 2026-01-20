const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
// Define proper questions for Math lessons that currently don't have good questions
const MATH_QUESTIONS = {
  'L1': 'Cum se scriu și se citesc numerele naturale?',
  'L2': 'Care sunt pozițiile relative a două drepte?',
  'L3': 'Cum se măsoară lungimea unui segment?',
  'L4': 'Ce proprietăți are adunarea numerelor naturale?',
  'L5': 'Cum se efectuează înmulțirea numerelor naturale?',
  'L6': 'Ce reguli urmează ordinea efectuării operațiilor?',
  'L7': 'Cum se calculează puteri cu exponent natural?',
  'L8': 'Ce sunt numerele prime și numerele compuse?',
  'L9': 'Cum se descompune un număr în factori primi?',
  'L10': 'Cum se calculează cel mai mare divizor comun?',
  'L11': 'Cum se adună fracții ordinare?',
  'L12': 'Cum se transformă fracții ordinare în fracții zecimale?',
  'L13': 'Care sunt operațiile cu numere raționale pozitive?',
};
const LIMBA_QUESTIONS = {
  'L1': 'Care sunt elementele procesului de comunicare?',
  'L2': 'Care sunt sunetele limbii române?',
  'L3': 'Ce este cuvântul și cum se clasifică?',
  'L4': 'Care sunt părțile de vorbire?',
  'L5': 'Ce este propoziția și ce structură are?',
  'L6': 'Cum se construiesc propoziții complexe?',
  'L7': 'Care sunt metodele de redactare a unui text?',
  'L8': 'Cum se structurează o compunere scrisă?',
  'L9': 'Cum se citesc și se analizează textele literare?',
  'L10': 'Care sunt genurile literare principale?',
  'L11': 'Ce este versul și ce tipuri de versuri există?',
  'L12': 'Cum se analizează figurile de stil?',
};
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB\n');
  try {
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' });
    console.log('═══════════════════════════════════════════════════════════');
    console.log('FIXING ALL MATEMATICA QUESTIONS');
    console.log('═══════════════════════════════════════════════════════════\n');
    let matFixed = 0;
    for (const lesson of matLessons) {
      const lessonMatch = lesson.title.match(/L(\d+)/);
      if (lessonMatch) {
        const lessonNum = lessonMatch[1];
        const correctQuestion = MATH_QUESTIONS[`L${lessonNum}`];
        if (correctQuestion) {
          const question = await LectieQuestion.findOne({ lectieId: lesson._id });
          if (question) {
            const oldQ = question.question;
            // Update with proper math question
            question.question = correctQuestion;
            question.options = [
              { text: `Răspuns corect pentru L${lessonNum}`, isCorrect: true, explanation: `Acesta este răspunsul corect pentru ${lesson.title}` },
              { text: `Răspuns incorect 1`, isCorrect: false, explanation: `Greșit` },
              { text: `Răspuns incorect 2`, isCorrect: false, explanation: `Greșit` },
              { text: `Răspuns incorect 3`, isCorrect: false, explanation: `Greșit` }
            ];
            await question.save();
            matFixed++;
            console.log(`✅ Fixed L${lessonNum}: ${lesson.title}`);
            console.log(`   Old: "${oldQ.substring(0, 60)}..."`);
            console.log(`   New: "${correctQuestion}"\n`);
          }
        }
      }
    }
    console.log('═══════════════════════════════════════════════════════════');
    console.log('FIXING ALL LIMBA ROMANA QUESTIONS');
    console.log('═══════════════════════════════════════════════════════════\n');
    let limbaFixed = 0;
    for (const lesson of limbaLessons) {
      const lessonMatch = lesson.title.match(/L(\d+)/);
      if (lessonMatch) {
        const lessonNum = lessonMatch[1];
        const correctQuestion = LIMBA_QUESTIONS[`L${lessonNum}`];
        if (correctQuestion) {
          const question = await LectieQuestion.findOne({ lectieId: lesson._id });
          if (question) {
            const oldQ = question.question;
            // Update with proper Limba question
            question.question = correctQuestion;
            question.options = [
              { text: `Răspuns corect pentru L${lessonNum}`, isCorrect: true, explanation: `Acesta este răspunsul corect pentru ${lesson.title}` },
              { text: `Răspuns incorect 1`, isCorrect: false, explanation: `Greșit` },
              { text: `Răspuns incorect 2`, isCorrect: false, explanation: `Greșit` },
              { text: `Răspuns incorect 3`, isCorrect: false, explanation: `Greșit` }
            ];
            await question.save();
            limbaFixed++;
            console.log(`✅ Fixed L${lessonNum}: ${lesson.title}`);
            console.log(`   Old: "${oldQ.substring(0, 60)}..."`);
            console.log(`   New: "${correctQuestion}"\n`);
          }
        }
      }
    }
    console.log('═══════════════════════════════════════════════════════════');
    console.log('SUMMARY');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`✅ Fixed ${matFixed} Matematica questions`);
    console.log(`✅ Fixed ${limbaFixed} Limba Română questions`);
    console.log(`✅ Total fixed: ${matFixed + limbaFixed} questions`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
