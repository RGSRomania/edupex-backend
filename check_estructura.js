const mongoose = require('mongoose');
require('dotenv').config();

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

const Materie = mongoose.model('Materie', MaterieSchema);
const Clasa = mongoose.model('Clasa', ClasaSchema);
const UnitateDeInvatare = mongoose.model('UnitateDeInvatare', UnitateDeInvatareSchema);
const Capitol = mongoose.model('Capitol', CapitolSchema);
const Lectie = mongoose.model('Lectie', LectieSchema);

async function checkStructure() {
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

    // Get all materii
    const materii = await Materie.find();
    console.log('📚 All subjects:');
    materii.forEach(m => {
      console.log(`   - ${m.name} (ID: ${m._id})`);
    });

    // Get Matematica
    const matematica = await Materie.findOne({ name: 'Matematica' });
    if (!matematica) {
      console.log('❌ Matematica not found');
      process.exit(1);
    }

    // Get Clasa V
    const clasaV = await Clasa.findOne({ materieId: matematica._id, name: 'V' });
    if (!clasaV) {
      console.log('❌ Clasa V not found');
      process.exit(1);
    }

    console.log(`\n📖 Clasa V - Matematica (ID: ${clasaV._id})`);

    // Get unitati
    const unitati = await UnitateDeInvatare.find({ clasaId: clasaV._id }).sort({ order: 1 });
    console.log(`\n📑 Learning units (${unitati.length}):`);
    unitati.forEach((u, idx) => {
      console.log(`   ${idx + 1}. ${u.name} (order: ${u.order})`);
    });

    // Get first 5 unitati and their chapters/lessons
    console.log('\n🎯 First 5 learning units and their content:');
    const first5Unitati = unitati.slice(0, 5);

    for (const unitate of first5Unitati) {
      console.log(`\n   📘 ${unitate.name}`);

      const capitole = await Capitol.find({ unitateId: unitate._id }).sort({ order: 1 });
      console.log(`      Chapters: ${capitole.length}`);

      for (const capitol of capitole) {
        const lectii = await Lectie.find({ capitolId: capitol._id }).sort({ order: 1 });
        console.log(`      ├─ ${capitol.name}: ${lectii.length} lessons`);

        // Print first few lessons
        lectii.slice(0, 3).forEach(lectie => {
          console.log(`         ├─ ${lectie.title} (ID: ${lectie._id})`);
        });
        if (lectii.length > 3) {
          console.log(`         └─ ... and ${lectii.length - 3} more`);
        }
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkStructure();

