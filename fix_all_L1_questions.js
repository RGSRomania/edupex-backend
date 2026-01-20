const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Finding all L1 Lecția 1 lessons in Matematica...\n');
  try {
    // Get ALL L1 lessons from Matematica (there might be multiple in different units)
    const l1Lessons = await Lectie.find({ 
      materieId: '696def9709bb56258f6ede84',
      title: 'L1 - Lecția 1'
    });
    console.log(`Found ${l1Lessons.length} L1 lessons in Matematica\n`);
    let fixed = 0;
    for (const lesson of l1Lessons) {
      console.log(`Processing: ${lesson.title} (Unit ID: ${lesson.unitateId})`);
      const question = await LectieQuestion.findOne({ lectieId: lesson._id });
      if (question) {
        const questionText = question.question?.toLowerCase() || '';
        const isLimbaQuestion = questionText.includes('cuvânt');
        if (isLimbaQuestion) {
          console.log(`  Old: "${question.question}"`);
          // Update with a math question
          const mathQuestion = {
            question: "Cât este suma numerelor naturale 15 și 27?",
            options: [
              { text: "42", isCorrect: true, explanation: "15 + 27 = 42" },
              { text: "40", isCorrect: false, explanation: "Calculul este incorect" },
              { text: "45", isCorrect: false, explanation: "Calculul este incorect" },
              { text: "35", isCorrect: false, explanation: "Calculul este incorect" }
            ]
          };
          question.question = mathQuestion.question;
          question.options = mathQuestion.options;
          await question.save();
          console.log(`  New: "${question.question}"`);
          fixed++;
        } else {
          console.log(`  Question is already correct: "${question.question.substring(0, 40)}..."`);
        }
      }
      console.log();
    }
    console.log(`✅ Fixed ${fixed} L1 questions`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
