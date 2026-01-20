const mongoose = require('mongoose');
const { Lectie } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  try {
    // Get all lessons sorted by _id for consistent pairing
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' }).sort({ _id: 1 });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' }).sort({ _id: 1 });
    console.log(`\nFound ${matLessons.length} Matematica lessons`);
    console.log(`Found ${limbaLessons.length} Limba Română lessons`);
    console.log('\n=== SWAPPING LESSON CONTENT ===');
    // Swap content between paired lessons
    const minLength = Math.min(matLessons.length, limbaLessons.length);
    for (let i = 0; i < minLength; i++) {
      const matLesson = matLessons[i];
      const limbaLesson = limbaLessons[i];
      // Store original content
      const matContent = matLesson.content;
      const limbaContent = limbaLesson.content;
      // Swap
      matLesson.content = limbaContent;
      limbaLesson.content = matContent;
      // Save
      await matLesson.save();
      await limbaLesson.save();
      console.log(`Swapped lesson ${i + 1}:`);
      console.log(`  Matematica: ${matLesson.title}`);
      console.log(`  Limba: ${limbaLesson.title}`);
    }
    console.log('\n✅ Lesson content swapped!');
    // Verify
    console.log('\n=== VERIFICATION ===');
    console.log('\nMatematica Lesson 1:');
    const matL1 = await Lectie.findById(matLessons[0]._id);
    console.log(`  Title: ${matL1.title}`);
    console.log(`  Summary: ${matL1.summary}`);
    console.log(`  Theory (first 80 chars): ${matL1.content?.theory?.substring(0, 80) || 'N/A'}...`);
    console.log('\nLimba Română Lesson 1:');
    const limbaL1 = await Lectie.findById(limbaLessons[0]._id);
    console.log(`  Title: ${limbaL1.title}`);
    console.log(`  Summary: ${limbaL1.summary}`);
    console.log(`  Theory (first 80 chars): ${limbaL1.content?.theory?.substring(0, 80) || 'N/A'}...`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
