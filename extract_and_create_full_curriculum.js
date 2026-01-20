const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    console.log('Starting Full Curriculum Extraction and Creation');
    console.log('='*80);
    // Define the complete curriculum structure based on manual analysis
    const curriculumPlan = {
      matematica: {
        materieId: '696def9709bb56258f6ede84',
        units: [
          {
            name: 'Unitatea 1: Operații cu numere naturale',
            lessons: [
              {
                title: 'L1 - Lecția 1',
                summary: 'Scrierea și citirea numerelor naturale',
                pageRange: '10-14'
              },
              {
                title: 'L2 - Lecția 2',
                summary: 'Reprezentarea pe axa numerelor. Compararea și ordonarea numerelor naturale',
                pageRange: '15-19'
              },
              {
                title: 'L3 - Lecția 3',
                summary: 'Adunarea numerelor naturale, proprietăți',
                pageRange: '20-25'
              },
              {
                title: 'L4 - Lecția 4',
                summary: 'Scăderea numerelor naturale',
                pageRange: '26-29'
              },
              {
                title: 'L5 - Lecția 5',
                summary: 'Înmulțirea numerelor naturale, proprietăți',
                pageRange: '30-35'
              },
              {
                title: 'L6 - Lecția 6',
                summary: 'Factor comun',
                pageRange: '36-37'
              },
              {
                title: 'L7 - Lecția 7',
                summary: 'Împărțirea cu rest 0 a numerelor naturale',
                pageRange: '39-42'
              },
              {
                title: 'L8 - Lecția 8',
                summary: 'Împărțirea cu rest a numerelor naturale',
                pageRange: '43-45'
              },
              {
                title: 'L9 - Lecția 9',
                summary: 'Puterea cu exponent natural a unui număr natural. Pătratul unui număr natural',
                pageRange: '46-49'
              },
              {
                title: 'L10 - Lecția 10',
                summary: 'Reguli de calcul cu puteri',
                pageRange: '50-52'
              },
              {
                title: 'L11 - Lecția 11',
                summary: 'Compararea puterilor',
                pageRange: '53-54'
              },
              {
                title: 'L12 - Lecția 12',
                summary: 'Scrierea în baza 10. Scrierea în baza 2',
                pageRange: '55-57'
              },
              {
                title: 'L13 - Lecția 13',
                summary: 'Ordinea efectuării operațiilor; utilizarea parantezelor',
                pageRange: '58-60'
              }
            ]
          }
        ]
      }
    };
    console.log('Curriculum plan loaded');
    console.log('Full curriculum extraction will require:');
    console.log('- Matematica: 51 lessons across 6 units');
    console.log('- Limba Română: 56+ lessons across 6 units');
    console.log('- Total: 107+ lessons');
    console.log('');
    console.log('Due to the complexity and volume of PDF extraction,');
    console.log('I recommend a phased approach:');
    console.log('');
    console.log('PHASE 1: Extract Unit 1 Matematica (13 lessons) - IN PROGRESS');
    console.log('PHASE 2: Extract Unit 2-6 Matematica (38 lessons)');
    console.log('PHASE 3: Extract Limba Română Units 1-6 (56+ lessons)');
    console.log('');
    console.log('='*80);
    // Check existing lessons
    const existingMat = await Lectie.find({ materieId: '696def9709bb56258f6ede84' });
    const existingLimba = await Lectie.find({ materieId: '696def9809bb56258f6ede85' });
    console.log(`\nCurrent database state:`);
    console.log(`  Matematica lessons: ${existingMat.length}`);
    console.log(`  Limba Română lessons: ${existingLimba.length}`);
    console.log(`  Total: ${existingMat.length + existingLimba.length}`);
    console.log('\n✅ Ready to begin Phase 1 extraction');
    console.log('Next: Create Python script to extract Unit 1 content from PDF');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
