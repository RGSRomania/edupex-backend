const mongoose = require('mongoose');
const { Lectie } = require('./models/Lesson');
require('dotenv').config();
const MAPPED_SUMMARIES = new Set([
  'Numere naturale și operații fundamentale',
  'Adunarea și scăderea numerelor naturale',
  'nmulțirea numerelor naturale',
  'mpărțirea numerelor naturale',
  'Operații cu numere naturale - exerciții',
  'Puterea unui număr natural',
  'Ordinea efectuării operațiilor',
  'Probleme cu numere naturale',
  'Descompunerea n factori primi',
  'Comunicare orală și redactare',
  'Textul narativ și descriptiv',
  'Textul dialogat și alte forme de expresie',
  'Comunicare și limba - procesul comunicării',
  'Sunetele limbii - pronunția și ortografia'
]);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    const allLessons = await Lectie.find({
      $or: [
        { materieId: '696def9709bb56258f6ede84' },
        { materieId: '696def9809bb56258f6ede85' }
      ]
    });
    const unmapped = [];
    const unmappedSummaries = new Set();
    for (const lesson of allLessons) {
      if (!MAPPED_SUMMARIES.has(lesson.summary)) {
        unmapped.push(lesson);
        unmappedSummaries.add(lesson.summary);
      }
    }
    console.log(`\nUnique unmapped summaries: ${unmappedSummaries.size}`);
    console.log('═════════════════════════════════════════════════════════\n');
    [...unmappedSummaries].forEach(summary => {
      console.log(`"${summary}": {`);
      console.log(`  question: '',`);
      console.log(`  options: [`);
      console.log(`    { text: '', isCorrect: true, explanation: '' },`);
      console.log(`    { text: '', isCorrect: false, explanation: '' },`);
      console.log(`    { text: '', isCorrect: false, explanation: '' },`);
      console.log(`    { text: '', isCorrect: false, explanation: '' }`);
      console.log(`  ]`);
      console.log(`},\n`);
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
