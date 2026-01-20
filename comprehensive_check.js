const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB\n');
  try {
    // Get all lessons
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' }).sort({ _id: 1 });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' }).sort({ _id: 1 });
    console.log('═══════════════════════════════════════════════════════════');
    console.log('MATEMATICA LESSONS - CONTENT VERIFICATION');
    console.log('═══════════════════════════════════════════════════════════\n');
    let matWithoutContent = 0;
    let matWithoutQuestions = 0;
    let matTotal = 0;
    for (const lesson of matLessons) {
      matTotal++;
      const hasTheory = lesson.content?.theory && lesson.content.theory.length > 0;
      const hasExamples = lesson.content?.examples && lesson.content.examples.length > 0;
      const hasTips = lesson.content?.tips && lesson.content.tips.length > 0;
      const hasQuestion = await LectieQuestion.countDocuments({ lectieId: lesson._id });
      if (!hasTheory || !hasExamples || !hasTips) {
        console.log(`❌ Lesson ${matTotal}: ${lesson.title}`);
        if (!hasTheory) console.log(`   - Missing: Theory`);
        if (!hasExamples) console.log(`   - Missing: Examples (${lesson.content?.examples?.length || 0})`);
        if (!hasTips) console.log(`   - Missing: Tips (${lesson.content?.tips?.length || 0})`);
        matWithoutContent++;
      }
      if (hasQuestion === 0) {
        console.log(`❌ Lesson ${matTotal}: NO QUESTION - ${lesson.title}`);
        matWithoutQuestions++;
      }
    }
    console.log(`\n✅ Matematica Summary:`);
    console.log(`   Total lessons: ${matTotal}`);
    console.log(`   With complete content: ${matTotal - matWithoutContent}`);
    console.log(`   Without complete content: ${matWithoutContent}`);
    console.log(`   With questions: ${matTotal - matWithoutQuestions}`);
    console.log(`   Without questions: ${matWithoutQuestions}`);
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('LIMBA ROMANA LESSONS - CONTENT VERIFICATION');
    console.log('═══════════════════════════════════════════════════════════\n');
    let limbaWithoutContent = 0;
    let limbaWithoutQuestions = 0;
    let limbaTotal = 0;
    for (const lesson of limbaLessons) {
      limbaTotal++;
      const hasTheory = lesson.content?.theory && lesson.content.theory.length > 0;
      const hasExamples = lesson.content?.examples && lesson.content.examples.length > 0;
      const hasTips = lesson.content?.tips && lesson.content.tips.length > 0;
      const hasQuestion = await LectieQuestion.countDocuments({ lectieId: lesson._id });
      if (!hasTheory || !hasExamples || !hasTips) {
        console.log(`❌ Lesson ${limbaTotal}: ${lesson.title}`);
        if (!hasTheory) console.log(`   - Missing: Theory`);
        if (!hasExamples) console.log(`   - Missing: Examples (${lesson.content?.examples?.length || 0})`);
        if (!hasTips) console.log(`   - Missing: Tips (${lesson.content?.tips?.length || 0})`);
        limbaWithoutContent++;
      }
      if (hasQuestion === 0) {
        console.log(`❌ Lesson ${limbaTotal}: NO QUESTION - ${lesson.title}`);
        limbaWithoutQuestions++;
      }
    }
    console.log(`\n✅ Limba Română Summary:`);
    console.log(`   Total lessons: ${limbaTotal}`);
    console.log(`   With complete content: ${limbaTotal - limbaWithoutContent}`);
    console.log(`   Without complete content: ${limbaWithoutContent}`);
    console.log(`   With questions: ${limbaTotal - limbaWithoutQuestions}`);
    console.log(`   Without questions: ${limbaWithoutQuestions}`);
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('OVERALL STATUS');
    console.log('═══════════════════════════════════════════════════════════\n');
    const totalLessons = matTotal + limbaTotal;
    const totalWithContent = (matTotal - matWithoutContent) + (limbaTotal - limbaWithoutContent);
    const totalWithQuestions = (matTotal - matWithoutQuestions) + (limbaTotal - limbaWithoutQuestions);
    console.log(`Total lessons: ${totalLessons}`);
    console.log(`Lessons with complete content: ${totalWithContent}/${totalLessons}`);
    console.log(`Lessons with questions: ${totalWithQuestions}/${totalLessons}`);
    if (totalWithContent === totalLessons && totalWithQuestions === totalLessons) {
      console.log(`\n✅ ALL LESSONS PERFECT - 100% COMPLETE`);
    } else {
      console.log(`\n⚠️  ISSUES FOUND:`);
      console.log(`   - Missing content: ${totalLessons - totalWithContent}`);
      console.log(`   - Missing questions: ${totalLessons - totalWithQuestions}`);
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
