const mongoose = require('mongoose');
require('dotenv').config();

// Define schemas
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  gradeLevel: Number,
  createdAt: { type: Date, default: Date.now }
});

const MaterieSchema = new mongoose.Schema({
  name: { type: String, enum: ['Matematica', 'Limba Romana'] },
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

const ClasaSchema = new mongoose.Schema({
  materieId: mongoose.Schema.Types.ObjectId,
  name: { type: String, enum: ['V', 'VI', 'VII', 'VIII'] },
  level: Number,
  createdAt: { type: Date, default: Date.now }
});

const UnitateDeInvatareSchema = new mongoose.Schema({
  clasaId: mongoose.Schema.Types.ObjectId,
  materieId: mongoose.Schema.Types.ObjectId,
  name: String,
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

const CapitolSchema = new mongoose.Schema({
  unitateId: mongoose.Schema.Types.ObjectId,
  name: String,
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

const LectieSchema = new mongoose.Schema({
  capitolId: mongoose.Schema.Types.ObjectId,
  unitateId: mongoose.Schema.Types.ObjectId,
  title: String,
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

const ProgressSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  lesson: mongoose.Schema.Types.ObjectId,
  completed: { type: Boolean, default: false },
  completedAt: Date,
  startedAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', UserSchema);
const Materie = mongoose.model('Materie', MaterieSchema);
const Clasa = mongoose.model('Clasa', ClasaSchema);
const UnitateDeInvatare = mongoose.model('UnitateDeInvatare', UnitateDeInvatareSchema);
const Capitol = mongoose.model('Capitol', CapitolSchema);
const Lectie = mongoose.model('Lectie', LectieSchema);
const Progress = mongoose.model('Progress', ProgressSchema);

async function generateLocalStorageData() {
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

    console.log(`✅ Found user: ${testUser.email} (ID: ${testUser._id})`);

    // Step 2: Get all completed progress records for this user
    console.log('\n📍 Step 2: Fetching completed lessons from database...');
    const completedProgress = await Progress.find({
      user: testUser._id,
      completed: true
    }).populate('lesson');

    console.log(`✅ Found ${completedProgress.length} completed lessons`);

    // Step 3: Build localStorage format
    console.log('\n📍 Step 3: Building localStorage object...');
    const lessonProgressObj = {};

    for (const progress of completedProgress) {
      if (!progress.lesson) continue;

      const lesson = progress.lesson;

      // Get the full hierarchy for this lesson
      const capitol = await Capitol.findById(lesson.capitolId);
      const unitate = await UnitateDeInvatare.findById(lesson.unitateId);
      const materie = await Materie.findById(lesson.materieId);

      if (!capitol || !unitate || !materie) continue;

      // Create localStorage key: subject_chapterNumber_lessonNumber
      // Extract numbers from lesson titles like "L1 - Lecția 1" -> lesson number
      const lessonNumberMatch = lesson.title.match(/L(\d+)/);
      const lessonNumber = lessonNumberMatch ? lessonNumberMatch[1] : lesson.order;

      // Subject is Matematica
      const subject = 'Matematica';
      const chapterNumber = unitate.order;

      const key = `${subject}_${chapterNumber}_${lessonNumber}`;
      lessonProgressObj[key] = 'completed';

      console.log(`   ✓ ${key} = completed`);
    }

    // Step 4: Display the localStorage object
    console.log('\n📊 localStorage object to set:');
    console.log(JSON.stringify(lessonProgressObj, null, 2));

    console.log('\n📋 Instructions to set localStorage:');
    console.log('1. Open browser Developer Tools (F12)');
    console.log('2. Go to Console tab');
    console.log('3. Copy and paste this command:');
    console.log(`\nlocalStorage.setItem('lessonProgress', '${JSON.stringify(lessonProgressObj)}');\n`);
    console.log('4. Press Enter');
    console.log('5. Refresh the page');
    console.log('6. All chapters should now be unlocked!');

    // Create a file with the command
    const fs = require('fs');
    const command = `localStorage.setItem('lessonProgress', '${JSON.stringify(lessonProgressObj)}');`;
    fs.writeFileSync('set_localstorage.txt', command);
    console.log('\n✅ Command saved to set_localstorage.txt');

    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

generateLocalStorageData();

