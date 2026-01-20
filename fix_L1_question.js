const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Fixing L1 Lecția 1 question...\n');
  try {
    // Get the first Matematica lesson
    const l1Lesson = await Lectie.findOne({ 
      materieId: '696def9709bb56258f6ede84',
      title: 'L1 - Lecția 1'
    });
    if (!l1Lesson) {
      console.log('Lesson not found');
      process.exit(1);
    }
    console.log(`Found lesson: ${l1Lesson.title}`);
    console.log(`Summary: ${l1Lesson.summary}\n`);
    // Find and fix the question
    const question = await LectieQuestion.findOne({ lectieId: l1Lesson._id });
    if (!question) {
      console.log('No question found');
      process.exit(1);
    }
    console.log(`Old question: "${question.question}"\n`);
    // Update with a math question based on the lesson summary
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
    console.log(`New question: "${question.question}"`);
    console.log(`Options:`);
    mathQuestion.options.forEach(opt => {
      console.log(`  - ${opt.text} ${opt.isCorrect ? '(✅ Correct)' : '(❌ Incorrect)'}`);
    });
    console.log(`\n✅ Fixed L1 question!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
