const mongoose = require('mongoose');
const { Lectie } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  try {
    // Get ALL lessons
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' }).sort({ _id: 1 });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' }).sort({ _id: 1 });
    console.log('\n=== ANALYZING CONTENT BY KEYWORDS ===');
    const matKeywordMatches = { hasMath: 0, hasLimba: 0 };
    const limbaKeywordMatches = { hasMath: 0, hasLimba: 0 };
    matLessons.forEach(lesson => {
      const theory = (lesson.content?.theory || '').toLowerCase();
      if (theory.includes('numere') || theory.includes('operații') || theory.includes('adunare') || theory.includes('înmulțire')) {
        matKeywordMatches.hasMath++;
      }
      if (theory.includes('cuvânt') || theory.includes('pronunție') || theory.includes('liter') || theory.includes('vorbire')) {
        matKeywordMatches.hasLimba++;
      }
    });
    limbaLessons.forEach(lesson => {
      const theory = (lesson.content?.theory || '').toLowerCase();
      if (theory.includes('numere') || theory.includes('operații') || theory.includes('adunare') || theory.includes('înmulțire')) {
        limbaKeywordMatches.hasMath++;
      }
      if (theory.includes('cuvânt') || theory.includes('pronunție') || theory.includes('liter') || theory.includes('vorbire')) {
        limbaKeywordMatches.hasLimba++;
      }
    });
    console.log(`\nMatematica lessons:`);
    console.log(`  With math keywords: ${matKeywordMatches.hasMath}`);
    console.log(`  With Limba keywords: ${matKeywordMatches.hasLimba}`);
    console.log(`\nLimba Română lessons:`);
    console.log(`  With math keywords: ${limbaKeywordMatches.hasMath}`);
    console.log(`  With Limba keywords: ${limbaKeywordMatches.hasLimba}`);
    if (matKeywordMatches.hasLimba > matKeywordMatches.hasMath) {
      console.log('\n❌ Matematica lessons STILL have mostly Limba content');
    } else if (matKeywordMatches.hasMath > matKeywordMatches.hasLimba) {
      console.log('\n✅ Matematica lessons CORRECTLY have math content');
    }
    if (limbaKeywordMatches.hasMath > limbaKeywordMatches.hasLimba) {
      console.log('❌ Limba Română lessons STILL have mostly math content');
    } else if (limbaKeywordMatches.hasLimba > limbaKeywordMatches.hasMath) {
      console.log('✅ Limba Română lessons CORRECTLY have Limba content');
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
