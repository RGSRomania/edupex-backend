const mongoose = require('mongoose');
const { Lectie } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  try {
    // Get ALL lessons for both subjects, including mixed ones
    const allLessons = await Lectie.find();
    console.log(`Total lessons in database: ${allLessons.length}`);
    // Separate by materieId
    const matLessonIds = [];
    const limbaLessonIds = [];
    allLessons.forEach(lesson => {
      if (lesson.materieId.toString() === '696def9709bb56258f6ede84') {
        matLessonIds.push(lesson._id);
      } else if (lesson.materieId.toString() === '696def9809bb56258f6ede85') {
        limbaLessonIds.push(lesson._id);
      }
    });
    console.log(`Matematica lessons: ${matLessonIds.length}`);
    console.log(`Limba Română lessons: ${limbaLessonIds.length}`);
    // Now swap ALL content across ALL lessons
    console.log('\n=== COLLECTING ALL CONTENT ===');
    const matLessonsData = [];
    const limbaLessonsData = [];
    for (const id of matLessonIds) {
      const lesson = await Lectie.findById(id);
      matLessonsData.push({ id, lesson, content: lesson.content });
    }
    for (const id of limbaLessonIds) {
      const lesson = await Lectie.findById(id);
      limbaLessonsData.push({ id, lesson, content: lesson.content });
    }
    console.log(`Collected ${matLessonsData.length} Matematica lesson contents`);
    console.log(`Collected ${limbaLessonsData.length} Limba Română lesson contents`);
    console.log('\n=== SWAPPING ALL CONTENTS ===');
    // Create reversed arrays for swapping
    const limbaLessonsDataReversed = limbaLessonsData.reverse();
    const matLessonsDataReversed = matLessonsData.reverse();
    // Assign Limba content to Matematica lessons
    for (let i = 0; i < matLessonsData.length; i++) {
      const matData = matLessonsData[i];
      const limbaData = limbaLessonsDataReversed[i];
      // Assign Limba content to Matematica lesson
      matData.lesson.content = limbaData.content;
      await matData.lesson.save();
      console.log(`Mat lesson ${i + 1}: content updated`);
    }
    // Assign Matematica content to Limba lessons (from reversed array)
    for (let i = 0; i < limbaLessonsData.length; i++) {
      const limbaData = limbaLessonsData[i];
      const matData = matLessonsDataReversed[i % matLessonsDataReversed.length];
      // Assign Matematica content to Limba lesson
      limbaData.lesson.content = matData.content;
      await limbaData.lesson.save();
      console.log(`Limba lesson ${i + 1}: content updated`);
    }
    console.log('\n✅ All contents swapped!');
    // Verify
    console.log('\n=== VERIFICATION ===');
    const verifyMat = await Lectie.findById(matLessonIds[0]);
    const verifyLimba = await Lectie.findById(limbaLessonIds[0]);
    console.log('\nMatematica Lesson 1:');
    console.log(`  Theory: ${verifyMat.content?.theory?.substring(0, 70)}...`);
    console.log('\nLimba Română Lesson 1:');
    console.log(`  Theory: ${verifyLimba.content?.theory?.substring(0, 70)}...`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
