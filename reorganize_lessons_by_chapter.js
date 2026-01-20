const mongoose = require('mongoose');
const { Unitate, Capitol, Lectie } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    console.log('Reorganizing lessons by chapters...\n');
    // Define chapter structure for MATEMATICA
    const matChapters = [
      {
        name: 'Unitatea 1: Operații cu numere naturale',
        order: 1,
        lessons: [
          'Numere naturale și operații fundamentale',
          'Adunarea și scăderea numerelor naturale',
          'nmulțirea numerelor naturale',
          'mpărțirea numerelor naturale',
        ]
      },
      {
        name: 'Unitatea 2: Ordinea operațiilor și probleme',
        order: 2,
        lessons: [
          'Ordinea efectuării operațiilor',
          'Operații cu numere naturale - exerciții',
          'Probleme cu numere naturale',
        ]
      },
      {
        name: 'Unitatea 3: Puteri',
        order: 3,
        lessons: [
          'Puterea unui număr natural',
        ]
      },
      {
        name: 'Unitatea 4: Factori și descompunere',
        order: 4,
        lessons: [
          'Descompunerea n factori primi',
        ]
      },
      {
        name: 'Unitatea 5: Texte',
        order: 5,
        lessons: [
          'Textul narativ și descriptiv',
          'Textul dialogat și alte forme de expresie',
        ]
      },
      {
        name: 'Unitatea 6: Comunicare',
        order: 6,
        lessons: [
          'Comunicare orală și redactare',
        ]
      }
    ];
    // Define chapter structure for LIMBA ROMANA
    const limbaChapters = [
      {
        name: 'Unitatea 1: Fonologie și semăntica',
        order: 1,
        lessons: [
          'Sunetele limbii - pronunția și ortografia',
          'Cuvntul și clasificarea cuvintelor',
        ]
      },
      {
        name: 'Unitatea 2: Morfologie',
        order: 2,
        lessons: [
          'Verbul și conjugarea acestuia',
          'Adjectivul și gradul acestuia',
          'Pronumele și clasificarea acestuia',
        ]
      },
      {
        name: 'Unitatea 3: Sintaxă și comunicare',
        order: 3,
        lessons: [
          'Comunicare și limba - procesul comunicării',
          'Comunicare și limbă - procesul comunicării',
        ]
      },
      {
        name: 'Unitatea 4: Ortografia și punctuație',
        order: 4,
        lessons: [
          'Ortografia și punctuația',
        ]
      },
      {
        name: 'Unitatea 5: Textul',
        order: 5,
        lessons: [
          'Textul narativ și descriptiv',
          'Textul dialogat și alte forme de expresie',
          'Textul și structura acestuia',
        ]
      },
      {
        name: 'Unitatea 6: Comunicare orală',
        order: 6,
        lessons: [
          'Comunicare orală și redactare',
        ]
      }
    ];
    console.log('Chapter structure defined. Now organizing lessons...\n');
    // Get all current lessons
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' });
    console.log(`Found ${matLessons.length} Matematica lessons`);
    console.log(`Found ${limbaLessons.length} Limba Romana lessons\n`);
    // Show the current lesson summaries
    console.log('=== MATEMATICA LESSONS FOUND ===');
    matLessons.forEach(l => console.log(`  - ${l.summary}`));
    console.log('\n=== LIMBA ROMANA LESSONS FOUND ===');
    limbaLessons.forEach(l => console.log(`  - ${l.summary}`));
    console.log('\n=== CHAPTER ORGANIZATION PLAN ===\n');
    console.log('MATEMATICA Chapters:');
    matChapters.forEach(ch => {
      console.log(`\n${ch.name} (Unitatea ${ch.order})`);
      ch.lessons.forEach(l => console.log(`  - ${l}`));
    });
    console.log('\n\nLIMBA ROMANA Chapters:');
    limbaChapters.forEach(ch => {
      console.log(`\n${ch.name} (Unitatea ${ch.order})`);
      ch.lessons.forEach(l => console.log(`  - ${l}`));
    });
    console.log('\n\n✅ Analysis complete. Chapter structure ready.');
    console.log('Next: Update database with chapter assignments.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
