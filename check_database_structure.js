const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({
  capitolId: mongoose.Schema.Types.ObjectId,
  unitateId: mongoose.Schema.Types.ObjectId,
  clasaId: mongoose.Schema.Types.ObjectId,
  materieId: mongoose.Schema.Types.ObjectId,
  title: String,
  order: Number,
  summary: String,
  content: {
    theory: String,
    examples: [String],
    tips: [String]
  },
  difficultyLevel: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  estimatedTime: Number,
  createdAt: { type: Date, default: Date.now }
});

const CapitolSchema = new mongoose.Schema({
  unitateId: mongoose.Schema.Types.ObjectId,
  clasaId: mongoose.Schema.Types.ObjectId,
  materieId: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

const Lectie = mongoose.model('Lectie', LectieSchema);
const Capitol = mongoose.model('Capitol', CapitolSchema);

async function checkDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('❌ MONGODB_URI not found in .env file');
      process.exit(1);
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: false,
      useUnifiedTopology: false
    });

    console.log('✅ Connected to MongoDB\n');

    // Count lessons
    const lessonCount = await Lectie.countDocuments();
    console.log(`📊 Total lessons in database: ${lessonCount}`);

    // Count chapters
    const capitolCount = await Capitol.countDocuments();
    console.log(`📊 Total chapters in database: ${capitolCount}`);

    // Get all chapters with their order
    console.log('\n📋 All chapters:');
    const chapters = await Capitol.find().sort({ order: 1 });
    chapters.forEach(cap => {
      console.log(`   Order ${cap.order}: ${cap.name} (ID: ${cap._id})`);
    });

    // Get lessons by chapter
    console.log('\n📚 Lessons by chapter:');
    for (const chapter of chapters) {
      const lessons = await Lectie.find({ capitolId: chapter._id }).sort({ order: 1 });
      console.log(`   Chapter ${chapter.order} (${chapter.name}): ${lessons.length} lessons`);
      if (lessons.length > 0 && lessons.length <= 5) {
        lessons.forEach(lesson => {
          console.log(`      - ${lesson.title}`);
        });
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();

