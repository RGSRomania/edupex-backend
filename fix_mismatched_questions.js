const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Loading correct questions from JSON files...\n');
  try {
    // Load JSON files
    const matPath = path.join(__dirname, '../Matematica_Clasa_5_Complete.json');
    const limbaPath = path.join(__dirname, '../LimbaRomana_Clasa_5_Complete.json');
    const matData = JSON.parse(fs.readFileSync(matPath, 'utf8'));
    const limbaData = JSON.parse(fs.readFileSync(limbaPath, 'utf8'));
    // Extract questions from JSON by lesson title
    const matQuestionsMap = {};
    const limbaQuestionsMap = {};
    (matData.unitati || []).forEach(unitate => {
      (unitate.capitole || []).forEach(capitol => {
        (capitol.lectii || []).forEach(lectie => {
          if (lectie.questions && lectie.questions.length > 0) {
            matQuestionsMap[lectie.title] = lectie.questions[0];
          }
        });
      });
    });
    (limbaData.unitati || []).forEach(unitate => {
      (unitate.capitole || []).forEach(capitol => {
        (capitol.lectii || []).forEach(lectie => {
          if (lectie.questions && lectie.questions.length > 0) {
            limbaQuestionsMap[lectie.title] = lectie.questions[0];
          }
        });
      });
    });
    console.log(`Loaded ${Object.keys(matQuestionsMap).length} Matematica questions from JSON`);
    console.log(`Loaded ${Object.keys(limbaQuestionsMap).length} Limba questions from JSON\n`);
    // Get all lessons from DB
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' });
    console.log('═══════════════════════════════════════════════════════════');
    console.log('FIXING MISMATCHED MATEMATICA QUESTIONS');
    console.log('═══════════════════════════════════════════════════════════\n');
    let matFixed = 0;
    for (const lesson of matLessons) {
      const questions = await LectieQuestion.find({ lectieId: lesson._id });
      for (const q of questions) {
        const questionText = q.question?.toLowerCase() || '';
        // Check if question is about Romanian language (wrong subject)
        const isWrongSubject = questionText.includes('cuvânt') || 
                              questionText.includes('substantiv') ||
                              questionText.includes('pronunție') ||
                              questionText.includes('literă') ||
                              questionText.includes('vorbire') ||
                              questionText.includes('comunicare');
        if (isWrongSubject) {
          // Try to find matching question in JSON by lesson number
          const lessonMatch = lesson.title.match(/L(\d+)/);
          if (lessonMatch) {
            const lessonNum = lessonMatch[1];
            // Find a math question from the JSON that matches this lesson
            const matchingQuestion = Object.entries(matQuestionsMap).find(([title]) => 
              title.includes(`L${lessonNum} -`)
            );
            if (matchingQuestion) {
              const correctQ = matchingQuestion[1];
              q.question = correctQ.question;
              q.options = correctQ.options;
              await q.save();
              console.log(`✅ Fixed: ${lesson.title}`);
              console.log(`   Old: "${questionText.substring(0, 50)}..."`);
              console.log(`   New: "${correctQ.question.substring(0, 50)}..."\n`);
              matFixed++;
            } else {
              console.log(`⚠️  No matching question found for: ${lesson.title}`);
            }
          }
        }
      }
    }
    console.log(`\n✅ Fixed ${matFixed} Matematica questions`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
