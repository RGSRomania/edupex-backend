const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
const fs = require('fs');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    console.log('Exporting current lessons backup...\n');
    const allLessons = await Lectie.find({
      $or: [
        { materieId: '696def9709bb56258f6ede84' },
        { materieId: '696def9809bb56258f6ede85' }
      ]
    }).sort({ _id: 1 });
    const exportData = {
      exportDate: new Date().toISOString(),
      totalLessons: allLessons.length,
      lessons: []
    };
    // Export each lesson with its question
    for (const lesson of allLessons) {
      const question = await LectieQuestion.findOne({ lectieId: lesson._id });
      exportData.lessons.push({
        _id: lesson._id,
        title: lesson.title,
        summary: lesson.summary,
        subject: lesson.materieId === '696def9709bb56258f6ede84' ? 'Matematica' : 'Limba Română',
        content: lesson.content,
        question: question ? {
          question: question.question,
          options: question.options
        } : null,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt
      });
    }
    // Save to file
    const filename = `LESSONS_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
    console.log(`✅ Exported ${exportData.lessons.length} lessons`);
    console.log(`📁 Saved to: ${filename}`);
    console.log(`📊 File size: ${(fs.statSync(filename).size / 1024).toFixed(2)} KB\n`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
