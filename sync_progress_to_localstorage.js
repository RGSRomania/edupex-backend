const mongoose = require('mongoose');
require('dotenv').config();

// Define schemas
const UserSchema = new mongoose.Schema({
  email: String,
  createdAt: { type: Date, default: Date.now }
});

const MaterieSchema = new mongoose.Schema({
  name: String,
  order: Number
});

const ClasaSchema = new mongoose.Schema({
  materieId: mongoose.Schema.Types.ObjectId,
  name: String,
  level: Number
});

const UnitateDeInvatareSchema = new mongoose.Schema({
  clasaId: mongoose.Schema.Types.ObjectId,
  materieId: mongoose.Schema.Types.ObjectId,
  name: String,
  order: Number
});

const CapitolSchema = new mongoose.Schema({
  unitateId: mongoose.Schema.Types.ObjectId,
  name: String,
  order: Number
});

const LectieSchema = new mongoose.Schema({
  capitolId: mongoose.Schema.Types.ObjectId,
  unitateId: mongoose.Schema.Types.ObjectId,
  materieId: mongoose.Schema.Types.ObjectId,
  title: String,
  order: Number
});

const ProgressSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  lesson: mongoose.Schema.Types.ObjectId,
  completed: Boolean,
  completedAt: Date
});

// Create models
const User = mongoose.model('User', UserSchema);
const Materie = mongoose.model('Materie', MaterieSchema);
const Clasa = mongoose.model('Clasa', ClasaSchema);
const UnitateDeInvatare = mongoose.model('UnitateDeInvatare', UnitateDeInvatareSchema);
const Capitol = mongoose.model('Capitol', CapitolSchema);
const Lectie = mongoose.model('Lectie', LectieSchema);
const Progress = mongoose.model('Progress', ProgressSchema);

async function syncProgressToLocalStorage() {
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

    // Step 1: Find test@edupex.com user
    console.log('📍 Step 1: Finding test@edupex.com user...');
    const testUser = await User.findOne({ email: 'test@edupex.com' });

    if (!testUser) {
      console.error('❌ User test@edupex.com not found!');
      process.exit(1);
    }

    console.log(`✅ Found user: ${testUser.email}`);

    // Step 2: Get all completed progress for this user
    console.log('\n📍 Step 2: Fetching all completed lessons...');
    const completedProgress = await Progress.find({
      user: testUser._id,
      completed: true
    });

    console.log(`✅ Found ${completedProgress.length} completed lessons`);

    // Step 3: Build localStorage object
    const lessonProgressObj = {};
    let processedCount = 0;

    for (const progress of completedProgress) {
      try {
        // Get lesson details
        const lesson = await Lectie.findById(progress.lesson);
        if (!lesson) {
          console.log(`⚠️  Lesson not found for ID: ${progress.lesson}`);
          continue;
        }

        // Get the unitate (chapter)
        const unitate = await UnitateDeInvatare.findById(lesson.unitateId);
        if (!unitate) {
          console.log(`⚠️  Unitate not found for lesson: ${lesson.title}`);
          continue;
        }

        // Extract lesson number from title like "L1" or "L2"
        const lessonMatch = lesson.title.match(/L(\d+)/);
        const lessonNumber = lessonMatch ? lessonMatch[1] : lesson.order;

        // Build key: Subject_ChapterNumber_LessonNumber
        const key = `Matematica_${unitate.order}_${lessonNumber}`;
        lessonProgressObj[key] = 'completed';

        console.log(`   ✓ ${key} (${lesson.title})`);
        processedCount++;
      } catch (err) {
        console.log(`❌ Error processing progress: ${err.message}`);
      }
    }

    console.log(`\n✅ Successfully processed ${processedCount} lessons\n`);

    // Step 4: Display results
    console.log('📊 Final localStorage object:');
    console.log(JSON.stringify(lessonProgressObj, null, 2));

    // Write to file for easy copying
    const fs = require('fs');
    const jsCode = `localStorage.setItem('lessonProgress', '${JSON.stringify(lessonProgressObj)}');`;
    fs.writeFileSync('apply_progress.js', jsCode);
    console.log('\n✅ Saved to apply_progress.js');

    // Also create a browser console command
    fs.writeFileSync('apply_progress_command.txt', jsCode);
    console.log('✅ Saved command to apply_progress_command.txt');

    console.log('\n📋 To apply this progress to your browser:');
    console.log('1. Open your browser DevTools (F12)');
    console.log('2. Go to Console tab');
    console.log('3. Paste this command:\n');
    console.log(jsCode);
    console.log('\n4. Press Enter');
    console.log('5. Refresh the page');
    console.log('6. All chapters 1-5 should now be unlocked!');

    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

syncProgressToLocalStorage();

