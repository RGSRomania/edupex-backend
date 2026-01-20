const mongoose = require('mongoose');
const { Materie, Lectie } = require('./models/Lesson');
require('dotenv').config();
// Define correct summaries for each subject
const matematicaSummaries = {
  'L1 - Lecția 1': 'Numere naturale și operații fundamentale',
  'L2 - Lecția 2': 'Adunarea și scăderea numerelor naturale',
  'L3 - Lecția 3': 'Înmulțirea numerelor naturale',
  'L4 - Lecția 4': 'Împărțirea numerelor naturale',
  'L5 - Lecția 5': 'Operații cu numere naturale - exerciții',
  'L6 - Lecția 6': 'Puterea unui număr natural',
  'L7 - Lecția 7': 'Ordinea efectuării operațiilor',
  'L8 - Lecția 8': 'Adunarea și scăderea numerelor naturale',
  'L9 - Lecția 9': 'Probleme cu numere naturale'
};
const limba_romana_Summaries = {
  'L1 - Lecția 1': 'Comunicare și limba - procesul comunicării',
  'L2 - Lecția 2': 'Sunetele limbii - pronunția și ortografia',
  'L3 - Lecția 3': 'Cuvântul și clasificarea cuvintelor',
  'L4 - Lecția 4': 'Comunicare și limbă - procesul comunicării',
  'L5 - Lecția 5': 'Ortografia și punctuația',
  'L6 - Lecția 6': 'Verbul și conjugarea acestuia',
  'L7 - Lecția 7': 'Adjectivul și gradul acestuia',
  'L8 - Lecția 8': 'Pronumele și clasificarea acestuia',
  'L9 - Lecția 9': 'Textul și structura acestuia'
};
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  try {
    // Get Matematica ID
    const matematica = await Materie.findOne({ name: 'Matematica' });
    const limba_romana = await Materie.findOne({ name: 'Limba Romana' });
    console.log('\n=== FIXING MATEMATICA LESSONS ===');
    const matLessons = await Lectie.find({ materieId: matematica._id });
    console.log(`Found ${matLessons.length} Matematica lessons`);
    // Fix Matematica lessons
    for (const lesson of matLessons) {
      const correctSummary = matematicaSummaries[lesson.title];
      if (correctSummary && lesson.summary !== correctSummary) {
        console.log(`Updating: ${lesson.title}`);
        console.log(`  Old: ${lesson.summary}`);
        console.log(`  New: ${correctSummary}`);
        lesson.summary = correctSummary;
        await lesson.save();
      }
    }
    console.log('\n=== FIXING LIMBA ROMANA LESSONS ===');
    const limbaLessons = await Lectie.find({ materieId: limba_romana._id });
    console.log(`Found ${limbaLessons.length} Limba Română lessons`);
    // Fix Limba Română lessons
    for (const lesson of limbaLessons) {
      const correctSummary = limba_romana_Summaries[lesson.title];
      if (correctSummary && lesson.summary !== correctSummary) {
        console.log(`Updating: ${lesson.title}`);
        console.log(`  Old: ${lesson.summary}`);
        console.log(`  New: ${correctSummary}`);
        lesson.summary = correctSummary;
        await lesson.save();
      }
    }
    console.log('\n✅ All lessons fixed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
