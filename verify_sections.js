const data = require('./curriculum_structure.json');

const clasa = data['Clasa a V a'];
const subject = Object.keys(clasa)[0];
const lesson = clasa[subject][0]['lectii'][0];

console.log('✅ Lesson:', lesson.name);
console.log('✅ Has sections:', !!lesson.sections);
console.log('✅ Number of sections:', lesson.sections ? lesson.sections.length : 0);

if (lesson.sections) {
  console.log('\n📚 Sections breakdown:');
  lesson.sections.forEach(section => {
    const contentLength = section.content.length;
    const contentPreview = section.content.substring(0, 60).replace(/\n/g, ' ') + '...';
    console.log(`  Part ${section.order}: ${section.title}`);
    console.log(`    Content length: ${contentLength} chars`);
    console.log(`    Preview: ${contentPreview}`);
  });
}

