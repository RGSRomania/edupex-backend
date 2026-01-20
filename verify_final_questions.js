const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    const allLessons = await Lectie.find({
      $or: [
        { materieId: '696def9709bb56258f6ede84' },
        { materieId: '696def9809bb56258f6ede85' }
      ]
    });
    console.log('\n════════════════════════════════════════════════════════════');
    console.log('FINAL VERIFICATION - LESSON-SPECIFIC QUESTIONS');
    console.log('════════════════════════════════════════════════════════════\n');
    // Sample 10 random lessons to show they're fixed
    const samples = allLessons.sort(() => Math.random() - 0.5).slice(0, 10);
    for (const lesson of samples) {
      const question = await LectieQuestion.findOne({ lectieId: lesson._id });
      console.log(`📚 ${lesson.title}`);
      console.log(`   Summary: ${lesson.summary}`);
      console.log(`   ❓ Question: "${question.question}"`);
      console.log(`   ✅ Correct answer: "${question.options[0].text}"`);
      console.log();
    }
    // Stats
    let questionsWithContent = 0;
    for (const lesson of allLessons) {
      const question = await LectieQuestion.findOne({ lectieId: lesson._id });
      if (question && question.question && question.options && question.options.length === 4) {
        const hasCorrectAnswer = question.options.some(o => o.isCorrect);
        if (hasCorrectAnswer) {
          questionsWithContent++;
        }
      }
    }
    console.log('════════════════════════════════════════════════════════════');
    console.log(`✅ Total lessons: ${allLessons.length}`);
    console.log(`✅ Lessons with proper questions: ${questionsWithContent}/${allLessons.length}`);
    console.log(`✅ SUCCESS RATE: ${Math.round(questionsWithContent / allLessons.length * 100)}%`);
    console.log('════════════════════════════════════════════════════════════\n');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
