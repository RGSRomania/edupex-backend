const mongoose = require('mongoose');
const { Lectie } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  try {
    // Get ALL lessons and list their theory content preview
    const allLessons = await Lectie.find().sort({ materieId: 1, _id: 1 }).limit(10);
    console.log('\n=== FIRST 10 LESSONS - THEORY PREVIEW ===');
    allLessons.forEach((lesson, i) => {
      const isMat = lesson.materieId.toString() === '696def9709bb56258f6ede84';
      const subject = isMat ? 'MAT' : 'LIM';
      const theory = lesson.content?.theory?.substring(0, 60) || 'NO THEORY';
      console.log(`${i + 1}. [${subject}] ${lesson.title}: ${theory}...`);
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
