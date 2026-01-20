const mongoose = require('mongoose');
const { Lectie } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  try {
    // Get ALL lessons for both subjects
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' });
    console.log(`\nFound ${matLessons.length} Matematica lessons`);
    console.log(`Found ${limbaLessons.length} Limba Română lessons`);
    console.log(`Total: ${matLessons.length + limbaLessons.length} lessons`);
    // Check if the first one is correctly swapped
    console.log('\nChecking first 3 lessons:');
    matLessons.slice(0, 3).forEach((l, i) => {
      console.log(`Mat Lesson ${i}: ${l._id} - ${l.title} - Theory: ${l.content?.theory?.substring(0, 50)}...`);
    });
    limbaLessons.slice(0, 3).forEach((l, i) => {
      console.log(`Limba Lesson ${i}: ${l._id} - ${l.title} - Theory: ${l.content?.theory?.substring(0, 50)}...`);
    });
    // Strategy: All lessons numbered 1-13 should have the SAME content within all units
    // So we need to find the correct matching
    // Get the FIRST lesson of each subject (which should have correct content after swap)
    const firstMatContent = matLessons[0].content;
    const firstLimbaContent = limbaLessons[0].content;
    console.log('\nFirst Mat lesson content theory:', firstMatContent?.theory?.substring(0, 50));
    console.log('First Limba lesson content theory:', firstLimbaContent?.theory?.substring(0, 50));
    // Check if they're still swapped by looking for keywords
    const matTheory = firstMatContent?.theory?.toLowerCase() || '';
    const limbaTheory = firstLimbaContent?.theory?.toLowerCase() || '';
    const hasMatKeywords = matTheory.includes('numere') || matTheory.includes('operații') || matTheory.includes('calcul');
    const hasLimbaKeywords = limbaTheory.includes('comunicare') || limbaTheory.includes('pronunție') || limbaTheory.includes('litere');
    console.log(`\nMat content has math keywords: ${hasMatKeywords}`);
    console.log(`Limba content has Romanian keywords: ${hasLimbaKeywords}`);
    if (hasMatKeywords && hasLimbaKeywords) {
      console.log('✅ Content appears to be correctly swapped!');
    } else if (!hasMatKeywords && !hasLimbaKeywords) {
      console.log('⚠️ Could not determine - content may not have clear keywords');
    } else {
      console.log('❌ Content is still swapped - needs another fix');
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
