const fs = require('fs');

console.log('📖 Reading curriculum_structure.json...');
const data = JSON.parse(fs.readFileSync('curriculum_structure.json'));
const clasa = data['Clasa a V a'];
const matematica = clasa['Matematica'];

console.log('✅ Loaded curriculum\n');

// Build localStorage for chapters 1-5
const lessonProgress = {};

// Process chapters 1-5
for (let i = 0; i < 5; i++) {
  const chapter = matematica[i];
  if (!chapter) break;

  const chapterNumber = chapter.number;
  const lectii = chapter.lectii || [];

  console.log(`📚 Chapter ${chapterNumber}: ${chapter.name}`);
  console.log(`   Lessons: ${lectii.length}`);

  // Mark all lessons in this chapter as completed
  for (const lectie of lectii) {
    const key = `Matematica_${chapterNumber}_${lectie.number}`;
    lessonProgress[key] = 'completed';
    console.log(`   ✓ ${key}`);
  }
  console.log();
}

// Display final object
console.log('📊 Final localStorage object:');
console.log(JSON.stringify(lessonProgress, null, 2));

// Save to file
const jsCommand = `localStorage.setItem('lessonProgress', '${JSON.stringify(lessonProgress)}');`;
fs.writeFileSync('unlock_chapters_1_5.txt', jsCommand);

console.log('\n📋 To unlock chapters 1-5:');
console.log('1. Open browser DevTools (F12)');
console.log('2. Go to Console tab');
console.log('3. Paste this command:\n');
console.log(jsCommand);
console.log('\n4. Press Enter');
console.log('5. Refresh the page (F5)');
console.log('6. All chapters 1-5 should now be unlocked!\n');
console.log('✅ Done!');

