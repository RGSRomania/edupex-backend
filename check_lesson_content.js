const mongoose = require('mongoose');
const { Lectie } = require('./models/Lesson');
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
    console.log(`Lesson ID: ${matLesson._id}`);
    console.log(`Title: ${matLesson.title}`);
    console.log(`Summary: ${matLesson.summary}`);
    console.log(`\nTheory (first 100 chars): ${matLesson.content?.theory?.substring(0, 100) || 'N/A'}...`);
    console.log(`\nExamples: ${matLesson.content?.examples?.length || 0} items`);
    if (matLesson.content?.examples?.length > 0) {
      console.log(`  First example: ${matLesson.content.examples[0].substring(0, 60)}...`);
    }
    console.log('\n=== LIMBA ROMANA - First Lesson ===');
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' }).limit(1);
    const limbaLesson = limbaLessons[0];
    console.log(`Lesson ID: ${limbaLesson._id}`);
    console.log(`Title: ${limbaLesson.title}`);
    console.log(`Summary: ${limbaLesson.summary}`);
    console.log(`\nTheory (first 100 chars): ${limbaLesson.content?.theory?.substring(0, 100) || 'N/A'}...`);
    console.log(`\nExamples: ${limbaLesson.content?.examples?.length || 0} items`);
    if (limbaLesson.content?.examples?.length > 0) {
      console.log(`  First example: ${limbaLesson.content.examples[0].substring(0, 60)}...`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
