const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
// Full curriculum plan with all lessons
const fullCurriculum = {
  matematica: {
    materieId: '696def9709bb56258f6ede84',
    units: [
      {
        unitId: 1,
        name: 'Unitatea 1: Operații cu numere naturale',
        lessons: [
          { num: 1, title: 'Scrierea și citirea numerelor naturale' },
          { num: 2, title: 'Reprezentarea pe axa numerelor. Compararea și ordonarea' },
          { num: 3, title: 'Adunarea numerelor naturale, proprietăți' },
          { num: 4, title: 'Scăderea numerelor naturale' },
          { num: 5, title: 'Înmulțirea numerelor naturale, proprietăți' },
          { num: 6, title: 'Factor comun' },
          { num: 7, title: 'Împărțirea cu rest 0 a numerelor naturale' },
          { num: 8, title: 'Împărțirea cu rest a numerelor naturale' },
          { num: 9, title: 'Puterea cu exponent natural a unui număr natural' },
          { num: 10, title: 'Reguli de calcul cu puteri' },
          { num: 11, title: 'Compararea puterilor' },
          { num: 12, title: 'Scrierea în baza 10. Scrierea în baza 2' },
          { num: 13, title: 'Ordinea efectuării operațiilor; utilizarea parantezelor' },
        ]
      },
      {
        unitId: 2,
        name: 'Unitatea 2: Metode aritmetice de rezolvare a problemelor',
        lessons: [
          { num: 1, title: 'Metoda reducerii la unitate' },
          { num: 2, title: 'Metoda comparației' },
          { num: 3, title: 'Metoda figurativă' },
          { num: 4, title: 'Metoda mersului invers' },
          { num: 5, title: 'Metoda falsei ipoteze' },
        ]
      },
      {
        unitId: 3,
        name: 'Unitatea 3: Divizibilitatea numerelor naturale',
        lessons: [
          { num: 1, title: 'Divizibilitatea numerelor naturale' },
          { num: 2, title: 'Criterii de divizibilitate' },
          { num: 3, title: 'Numere prime. Numere compuse' },
        ]
      },
      {
        unitId: 4,
        name: 'Unitatea 4: Fracții ordinare',
        lessons: [
          { num: 1, title: 'Fracții ordinare. Fracții echivalente. Procente' },
          { num: 2, title: 'Compararea fracțiilor cu același numitor/numărător' },
          { num: 3, title: 'Introducerea și scoaterea întregilor dintr-o fracție' },
          { num: 4, title: 'CMMDC. Amplificarea și simplificarea fracțiilor' },
          { num: 5, title: 'CMMMC. Aducerea fracțiilor la un numitor comun' },
          { num: 6, title: 'Adunarea și scăderea fracțiilor' },
          { num: 7, title: 'Înmulțirea fracțiilor' },
          { num: 8, title: 'Împărțirea fracțiilor ordinare' },
          { num: 9, title: 'Puterea cu exponent natural a unei fracții ordinare' },
          { num: 10, title: 'Fracții/procente dintr-un număr natural' },
        ]
      },
      {
        unitId: 5,
        name: 'Unitatea 5: Fracții zecimale',
        lessons: [
          { num: 1, title: 'Fracții zecimale; scrierea; transformări' },
          { num: 2, title: 'Aproximări; comparare; ordonare; reprezentare pe axa' },
          { num: 3, title: 'Adunarea și scăderea fracțiilor zecimale' },
          { num: 4, title: 'Înmulțirea fracțiilor zecimale' },
          { num: 5, title: 'Împărțirea numerelor; media aritmetică; transformări' },
          { num: 6, title: 'Împărțirea fracțiilor zecimale; transformări periodice' },
          { num: 7, title: 'Număr rațional pozitiv; ordinea operațiilor' },
          { num: 8, title: 'Metode aritmetice cu fracții și unități de măsură' },
          { num: 9, title: 'Probleme de organizare a datelor; grafice; statistică' },
        ]
      },
      {
        unitId: 6,
        name: 'Unitatea 6: Elemente de geometrie și unități de măsură',
        lessons: [
          { num: 1, title: 'Punct, dreaptă, plan, semiplan, semidreaptă, segment' },
          { num: 2, title: 'Pozițiile relative ale unui punct; colinaritate; drepte' },
          { num: 3, title: 'Lungimea unui segment; distanță; congruență' },
          { num: 4, title: 'Mijlocul unui segment; simetrie' },
          { num: 5, title: 'Unghi: definiție, notații, elemente' },
          { num: 6, title: 'Măsura unui unghi; congruență' },
          { num: 7, title: 'Clasificarea unghiurilor; calcule' },
          { num: 8, title: 'Figuri congruente; axa de simetrie' },
          { num: 9, title: 'Unități de măsură pentru lungime; perimetru' },
          { num: 10, title: 'Unități de măsură pentru arie; pătrat/dreptunghi' },
          { num: 11, title: 'Unități de măsură pentru volum; cub/paralelipiped' },
        ]
      }
    ]
  }
};
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    console.log('\n' + '='*80);
    console.log('IMPORTING FULL CURRICULUM INTO DATABASE');
    console.log('='*80);
    let totalCreated = 0;
    let unitCount = 0;
    for (const unit of fullCurriculum.matematica.units) {
      unitCount++;
      console.log(`\n${unit.name}`);
      console.log(`  Importing ${unit.lessons.length} lessons...`);
      for (const lesson of unit.lessons) {
        try {
          // Check if lesson already exists
          const existingLectie = await Lectie.findOne({
            summary: lesson.title,
            materieId: fullCurriculum.matematica.materieId
          });
          if (!existingLectie) {
            // Create new lesson
            const newLectie = new Lectie({
              title: lesson.title,
              summary: lesson.title,
              content: `Lecția ${lesson.num}: ${lesson.title}\n\nConținut extras din Manual Clasa a V-a`,
              examples: [`Exemplu din lecția ${lesson.num}`],
              tips: [`Sfat pentru lecția ${lesson.num}`],
              materieId: fullCurriculum.matematica.materieId
            });
            await newLectie.save();
            // Create a sample question for the lesson
            const sampleQuestions = [
              {
                lectieId: newLectie._id,
                question: `Întrebare de test pentru: ${lesson.title}`,
                answers: [
                  { text: 'Răspuns corect pentru ' + lesson.num, correct: true },
                  { text: 'Răspuns incorect 1', correct: false },
                  { text: 'Răspuns incorect 2', correct: false },
                  { text: 'Răspuns incorect 3', correct: false }
                ]
              }
            ];
            for (const q of sampleQuestions) {
              const newQuestion = new LectieQuestion(q);
              await newQuestion.save();
            }
            totalCreated++;
            console.log(`    ✓ L${lesson.num}: ${lesson.title.substring(0, 45)}...`);
          } else {
            console.log(`    → L${lesson.num}: Already exists`);
          }
        } catch (err) {
          console.error(`    ✗ Error creating lesson ${lesson.num}:`, err.message);
        }
      }
    }
    console.log('\n' + '='*80);
    console.log(`✅ IMPORT COMPLETE!`);
    console.log(`   Units processed: ${unitCount}`);
    console.log(`   New lessons created: ${totalCreated}`);
    console.log(`   Total lessons in database:`);
    const totalMat = await Lectie.countDocuments({ materieId: fullCurriculum.matematica.materieId });
    console.log(`     Matematica: ${totalMat}`);
    console.log('\n🎉 Full curriculum is now available in the database!');
    console.log('   Next: Restart frontend to see all lessons');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
