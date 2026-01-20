const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  try {
    // Get first lesson from each subject
    console.log('\n=== MATEMATICA - First Lesson ===');
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' }).limit(1);
    const matLesson = matLessons[0];
    console.log(`Lesson: ${matLesson.title}`);
    console.log(`Lesson ID: ${matLesson._id}`);
    const matQuestions = await LectieQuestion.find({ lectieId: matLesson._id });
    console.log(`Found ${matQuestions.length} questions`);
    matQuestions.slice(0, 2).forEach(q => {
      console.log(`  - ${q.question.substring(0, 60)}...`);
    });
    console.log('\n=== LIMBA ROMANA - First Lesson ===');
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' }).limit(1);
    const limbaLesson = limbaLessons[0];
    console.log(`Lesson: ${limbaLesson.title}`);
    console.log(`Lesson ID: ${limbaLesson._id}`);
    const limbaQuestions = await LectieQuestion.find({ lectieId: limbaLesson._id });
    console.log(`Found ${limbaQuestions.length} questions`);
    limbaQuestions.slice(0, 2).forEach(q => {
      console.log(`  - ${q.question.substring(0, 60)}...`);
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
