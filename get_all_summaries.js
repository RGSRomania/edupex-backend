const mongoose = require('mongoose');
const { Lectie } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' }).sort({ _id: 1 });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' }).sort({ _id: 1 });
    console.log('=== ALL MATEMATICA LESSONS ===\n');
    matLessons.forEach(lesson => {
      console.log(`Title: ${lesson.title}`);
      console.log(`Summary: ${lesson.summary}`);
      console.log();
    });
    console.log('\n=== ALL LIMBA ROMANA LESSONS ===\n');
    limbaLessons.forEach(lesson => {
      console.log(`Title: ${lesson.title}`);
      console.log(`Summary: ${lesson.summary}`);
      console.log();
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
