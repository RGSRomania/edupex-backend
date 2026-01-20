const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Checking question options...\n');
  try {
    // Check a few lessons from both subjects
    const matL1 = await Lectie.findOne({ 
      materieId: '696def9709bb56258f6ede84',
      title: 'L1 - Lecția 1'
    });
    const matL4 = await Lectie.findOne({ 
      materieId: '696def9709bb56258f6ede84',
      title: 'L4 - Lecția 4'
    });
    if (matL1) {
      const q1 = await LectieQuestion.findOne({ lectieId: matL1._id });
      console.log('=== MATEMATICA L1 ===');
      console.log(`Question: ${q1.question}`);
      console.log(`Options: ${q1.options.length}`);
      q1.options.forEach((opt, i) => {
        console.log(`  ${i+1}. ${opt.text} ${opt.isCorrect ? '✅' : '❌'}`);
      });
    }
    if (matL4) {
      const q4 = await LectieQuestion.findOne({ lectieId: matL4._id });
      console.log('\n=== MATEMATICA L4 ===');
      console.log(`Question: ${q4.question}`);
      console.log(`Options: ${q4.options.length}`);
      q4.options.forEach((opt, i) => {
        console.log(`  ${i+1}. ${opt.text} ${opt.isCorrect ? '✅' : '❌'}`);
      });
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
