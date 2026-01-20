const mongoose = require('mongoose');
const { Lectie } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  try {
    // Get first and second lesson from each subject
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' }).limit(2);
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' }).limit(2);
    console.log('\n════════════════════════════════════════════════════════');
    console.log('MATEMATICA LESSON 1');
    console.log('════════════════════════════════════════════════════════');
    console.log(`Title: ${matLessons[0].title}`);
    console.log(`Summary: ${matLessons[0].summary}`);
    console.log(`Has Theory: ${matLessons[0].content?.theory ? '✅ YES' : '❌ NO'}`);
    console.log(`Has Examples: ${matLessons[0].content?.examples?.length > 0 ? '✅ YES' : '❌ NO'}`);
    console.log(`Has Tips: ${matLessons[0].content?.tips?.length > 0 ? '✅ YES' : '❌ NO'}`);
    console.log('\n════════════════════════════════════════════════════════');
    console.log('MATEMATICA LESSON 2');
    console.log('════════════════════════════════════════════════════════');
    console.log(`Title: ${matLessons[1].title}`);
    console.log(`Summary: ${matLessons[1].summary}`);
    console.log(`Has Theory: ${matLessons[1].content?.theory ? '✅ YES' : '❌ NO'}`);
    console.log(`Has Examples: ${matLessons[1].content?.examples?.length > 0 ? '✅ YES' : '❌ NO'}`);
    console.log(`Has Tips: ${matLessons[1].content?.tips?.length > 0 ? '✅ YES' : '❌ NO'}`);
    console.log('\n════════════════════════════════════════════════════════');
    console.log('LIMBA ROMANA LESSON 1');
    console.log('════════════════════════════════════════════════════════');
    console.log(`Title: ${limbaLessons[0].title}`);
    console.log(`Summary: ${limbaLessons[0].summary}`);
    console.log(`Has Theory: ${limbaLessons[0].content?.theory ? '✅ YES' : '❌ NO'}`);
    if (limbaLessons[0].content?.theory) {
      console.log(`Theory preview: ${limbaLessons[0].content.theory.substring(0, 80)}...`);
    }
    console.log(`Has Examples: ${limbaLessons[0].content?.examples?.length > 0 ? '✅ YES' : '❌ NO'}`);
    console.log(`Has Tips: ${limbaLessons[0].content?.tips?.length > 0 ? '✅ YES' : '❌ NO'}`);
    console.log('\n════════════════════════════════════════════════════════');
    console.log('LIMBA ROMANA LESSON 2');
    console.log('════════════════════════════════════════════════════════');
    console.log(`Title: ${limbaLessons[1].title}`);
    console.log(`Summary: ${limbaLessons[1].summary}`);
    console.log(`Has Theory: ${limbaLessons[1].content?.theory ? '✅ YES' : '❌ NO'}`);
    if (limbaLessons[1].content?.theory) {
      console.log(`Theory preview: ${limbaLessons[1].content.theory.substring(0, 80)}...`);
    }
    console.log(`Has Examples: ${limbaLessons[1].content?.examples?.length > 0 ? '✅ YES' : '❌ NO'}`);
    console.log(`Has Tips: ${limbaLessons[1].content?.tips?.length > 0 ? '✅ YES' : '❌ NO'}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
