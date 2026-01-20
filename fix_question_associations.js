const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  try {
    // Get all Matematica lessons
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' }).sort({ _id: 1 });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' }).sort({ _id: 1 });
    console.log(`\nFound ${matLessons.length} Matematica lessons`);
    console.log(`Found ${limbaLessons.length} Limba Română lessons`);
    // Create mappings: lesson IDs in order
    const matLessonIds = matLessons.map(l => l._id.toString());
    const limbaLessonIds = limbaLessons.map(l => l._id.toString());
    console.log('\n=== ANALYZING QUESTION DISTRIBUTION ===');
    // Count questions for each lesson
    let matQuestionCount = 0;
    let limbaQuestionCount = 0;
    for (const lesson of matLessons) {
      const questions = await LectieQuestion.find({ lectieId: lesson._id });
      matQuestionCount += questions.length;
    }
    for (const lesson of limbaLessons) {
      const questions = await LectieQuestion.find({ lectieId: lesson._id });
      limbaQuestionCount += questions.length;
    }
    console.log(`Matematica lessons have ${matQuestionCount} total questions`);
    console.log(`Limba Română lessons have ${limbaQuestionCount} total questions`);
    // Get all questions and their current lesson associations
    const allQuestions = await LectieQuestion.find();
    console.log(`\nTotal questions in database: ${allQuestions.length}`);
    // Analyze: collect all questions currently linked to Matematica lessons
    const questionsInMatLessons = await LectieQuestion.find({ lectieId: { $in: matLessonIds } });
    const questionsInLimbaLessons = await LectieQuestion.find({ lectieId: { $in: limbaLessonIds } });
    console.log(`Questions linked to Matematica lessons: ${questionsInMatLessons.length}`);
    console.log(`Questions linked to Limba Română lessons: ${questionsInLimbaLessons.length}`);
    // Sample: check first question from each group
    if (questionsInMatLessons.length > 0) {
      console.log(`\nSample question in Matematica lesson: "${questionsInMatLessons[0].question.substring(0, 50)}..."`);
    }
    if (questionsInLimbaLessons.length > 0) {
      console.log(`Sample question in Limba Română lesson: "${questionsInLimbaLessons[0].question.substring(0, 50)}..."`);
    }
    // Strategy: Swap question associations
    // Move questions from Matematica lessons to Limba Română lessons (by position)
    // Move questions from Limba Română lessons to Matematica lessons (by position)
    console.log('\n=== SWAPPING QUESTION ASSOCIATIONS ===');
    // Create a backup and then swap
    const swapOperations = [];
    for (let i = 0; i < Math.min(matLessonIds.length, limbaLessonIds.length); i++) {
      const matLessonId = matLessonIds[i];
      const limbaLessonId = limbaLessonIds[i];
      // Get questions for this pair
      const matQuestions = await LectieQuestion.find({ lectieId: matLessonId });
      const limbaQuestions = await LectieQuestion.find({ lectieId: limbaLessonId });
      // Swap: reassign questions
      for (const q of matQuestions) {
        q.lectieId = limbaLessonId;
        await q.save();
        console.log(`Moved question "${q.question.substring(0, 40)}..." to Limba Română lesson`);
      }
      for (const q of limbaQuestions) {
        q.lectieId = matLessonId;
        await q.save();
        console.log(`Moved question "${q.question.substring(0, 40)}..." to Matematica lesson`);
      }
    }
    console.log('\n✅ Question associations swapped!');
    // Verify
    console.log('\n=== VERIFICATION ===');
    console.log('Verifying Matematica Lesson 1:');
    const matL1 = matLessons[0];
    const matL1Q = await LectieQuestion.find({ lectieId: matL1._id });
    console.log(`  Questions: ${matL1Q.length}`);
    matL1Q.slice(0, 2).forEach(q => {
      console.log(`    - ${q.question.substring(0, 50)}...`);
    });
    console.log('\nVerifying Limba Română Lesson 1:');
    const limbaL1 = limbaLessons[0];
    const limbaL1Q = await LectieQuestion.find({ lectieId: limbaL1._id });
    console.log(`  Questions: ${limbaL1Q.length}`);
    limbaL1Q.slice(0, 2).forEach(q => {
      console.log(`    - ${q.question.substring(0, 50)}...`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
