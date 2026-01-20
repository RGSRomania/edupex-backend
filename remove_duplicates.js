const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    console.log('Removing duplicate lessons...\n');
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' }).sort({ summary: 1, createdAt: 1 });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' }).sort({ summary: 1, createdAt: 1 });
    let matDeletedCount = 0;
    let limbaDeletedCount = 0;
    // Function to remove duplicates
    const removeDuplicates = async (lessons, subject) => {
      const seen = {};
      let deletedCount = 0;
      for (const lesson of lessons) {
        if (!seen[lesson.summary]) {
          // Keep first instance
          seen[lesson.summary] = lesson._id;
          console.log(`✅ Keeping: ${lesson.summary} (ID: ${lesson._id})`);
        } else {
          // Delete duplicate
          console.log(`   ❌ Deleting duplicate: ${lesson.summary} (ID: ${lesson._id})`);
          // Delete lesson
          await Lectie.findByIdAndDelete(lesson._id);
          // Delete associated question
          await LectieQuestion.deleteMany({ lectieId: lesson._id });
          deletedCount++;
        }
      }
      return deletedCount;
    };
    console.log('=== MATEMATICA ===\n');
    matDeletedCount = await removeDuplicates(matLessons, 'Matematica');
    console.log('\n=== LIMBA ROMANA ===\n');
    limbaDeletedCount = await removeDuplicates(limbaLessons, 'Limba Romana');
    console.log(`\n════════════════════════════════════════════════════════`);
    console.log(`✅ Deleted ${matDeletedCount} Matematica duplicates`);
    console.log(`✅ Deleted ${limbaDeletedCount} Limba Romana duplicates`);
    console.log(`✅ Total deleted: ${matDeletedCount + limbaDeletedCount} lessons\n`);
    // Verify results
    const matAfter = await Lectie.find({ materieId: '696def9709bb56258f6ede84' });
    const limbaAfter = await Lectie.find({ materieId: '696def9809bb56258f6ede85' });
    console.log(`Matematica remaining: ${matAfter.length} lessons`);
    console.log(`Limba Romana remaining: ${limbaAfter.length} lessons`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
