const data = require('./curriculum_structure.json');

// Get the lesson
const clasa = data['Clasa a V a'];
const subject = Object.keys(clasa)[0]; // Get first subject key
const lesson = clasa[subject][0]['lectii'][0];

console.log('✅ Lesson name:', lesson.name);
console.log('✅ Summary length:', lesson.summary.length, 'characters');
console.log('\n=== SUMMARY PREVIEW (First 500 chars) ===');
console.log(lesson.summary.substring(0, 500));
console.log('\n... (summary continues)');

