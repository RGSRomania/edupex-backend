const mongoose = require('mongoose');
require('dotenv').config();

// Define all schemas
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  gradeLevel: Number,
  xpPoints: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const MaterieSchema = new mongoose.Schema({
  name: { type: String, enum: ['Matematica', 'Limba Romana'] },
  description: String,
  icon: String,
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

const ClasaSchema = new mongoose.Schema({
  materieId: mongoose.Schema.Types.ObjectId,
  name: { type: String, enum: ['V', 'VI', 'VII', 'VIII'] },
  level: Number,
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

const UnitateDeInvatareSchema = new mongoose.Schema({
  clasaId: mongoose.Schema.Types.ObjectId,
  materieId: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  order: Number,
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

const ProgressSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  lesson: mongoose.Schema.Types.ObjectId,
  completed: { type: Boolean, default: false },
  score: { type: Number, min: 0, max: 100 },
  xpEarned: { type: Number, default: 0 },
  heartsLost: { type: Number, default: 0 },
  answers: [{
    questionIndex: Number,
    userAnswer: mongoose.Schema.Types.Mixed,
    correct: Boolean,
    timeSpent: Number
  }],
  timeSpent: { type: Number, default: 0 },
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

async function createProgressRecords() {
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

    console.log('✅ Connected to MongoDB');

    // Step 1: Find test@edupex.com user
    console.log('\n📍 Step 1: Finding test@edupex.com user...');
    const testUser = await User.findOne({ email: 'test@edupex.com' });

    if (!testUser) {
      console.error('❌ User test@edupex.com not found!');
      process.exit(1);
    }

    console.log(`✅ Found user: ${testUser.email}`);
    console.log(`   Username: ${testUser.username}`);
    console.log(`   User ID: ${testUser._id}`);
    console.log(`   Grade Level: ${testUser.gradeLevel}`);

    // Step 2: Get lessons from Unitati (chapters) 1-5
    console.log('\n📍 Step 2: Getting lessons from Unitati (chapters) 1-5...');

    // Find Matematica subject and Clasa V
    const matematica = await Materie.findOne({ name: 'Matematica' });
    const clasaV = await Clasa.findOne({ name: 'V', materieId: matematica._id });

    // Get unitati 1-5
    const unitati = await UnitateDeInvatare.find({
      clasaId: clasaV._id,
      order: { $gte: 1, $lte: 5 }
    }).sort({ order: 1 });

    console.log(`📑 Found ${unitati.length} unitati (chapters 1-5):`);
    unitati.forEach(u => {
      console.log(`   ${u.order}. ${u.name}`);
    });

    // Get all lessons from these unitati
    const filteredLessons = await Lectie.find({
      unitateId: { $in: unitati.map(u => u._id) }
    }).sort({ order: 1 });

    console.log(`\n✅ Found ${filteredLessons.length} lessons in chapters 1-5:`);
    filteredLessons.slice(0, 10).forEach((lesson, index) => {
      console.log(`   ${index + 1}. ${lesson.title}`);
    });
    if (filteredLessons.length > 10) {
      console.log(`   ... and ${filteredLessons.length - 10} more`);
    }

    // Step 3: Create Progress records
    console.log('\n📍 Step 3: Creating Progress records...');
    let created = 0;
    let skipped = 0;

    for (const lesson of filteredLessons) {
      try {
        // Check if progress record already exists
        const existingProgress = await Progress.findOne({
          user: testUser._id,
          lesson: lesson._id
        });

        if (existingProgress) {
          skipped++;
          continue;
        }

        // Create new progress record
        const progressRecord = new Progress({
          user: testUser._id,
          lesson: lesson._id,
          completed: true,
          score: 100,
          xpEarned: 10,
          heartsLost: 0,
          answers: [],
          timeSpent: 0,
          completedAt: new Date(),
          startedAt: new Date()
        });

        await progressRecord.save();
        created++;
      } catch (error) {
        console.log(`   ❌ Error creating progress for ${lesson.title}: ${error.message}`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Total lessons in chapters 1-5: ${filteredLessons.length}`);
    console.log(`   Progress records created: ${created}`);
    console.log(`   Progress records skipped (already exist): ${skipped}`);
    console.log(`   Total progress records for user: ${created + skipped}`);

    // Verify by counting progress records
    const totalProgress = await Progress.countDocuments({ user: testUser._id });
    console.log(`   Total verified in database: ${totalProgress}`);

    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

createProgressRecords();

