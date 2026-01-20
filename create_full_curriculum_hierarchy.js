const mongoose = require('mongoose');
const { Materie, Clasa, UnitateDeInvatare, Capitol, Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    console.log('\n' + '='*80);
    console.log('CREATING FULL CURRICULUM HIERARCHY');
    console.log('='*80);
    // Get or create Matematica
    let materie = await Materie.findOne({ name: 'Matematica' });
    if (!materie) {
      materie = await Materie.create({ name: 'Matematica' });
      console.log('✓ Created Materie: Matematica');
    } else {
      console.log('✓ Found existing Materie: Matematica');
    }
    // Get or create Clasa V
    let clasa = await Clasa.findOne({ name: 'V', materieId: materie._id });
    if (!clasa) {
      clasa = await Clasa.create({ 
        name: 'V', 
        level: 5,
        materieId: materie._id
      });
      console.log('✓ Created Clasa: V');
    } else {
      console.log('✓ Found existing Clasa: V');
    }
    // Define 6 units
    const unitsData = [
      { name: 'Unitatea 1: Operații cu numere naturale', order: 1 },
      { name: 'Unitatea 2: Metode aritmetice de rezolvare a problemelor', order: 2 },
      { name: 'Unitatea 3: Divizibilitatea numerelor naturale', order: 3 },
      { name: 'Unitatea 4: Fracții ordinare', order: 4 },
      { name: 'Unitatea 5: Fracții zecimale', order: 5 },
      { name: 'Unitatea 6: Elemente de geometrie și unități de măsură', order: 6 }
    ];
    const lessonsPerUnit = [
      { // Unit 1
        titles: [
          'Scrierea și citirea numerelor naturale',
          'Reprezentarea pe axa numerelor. Compararea și ordonarea',
          'Adunarea numerelor naturale, proprietăți',
          'Scăderea numerelor naturale',
          'Înmulțirea numerelor naturale, proprietăți',
          'Factor comun',
          'Împărțirea cu rest 0 a numerelor naturale',
          'Împărțirea cu rest a numerelor naturale',
          'Puterea cu exponent natural a unui număr natural',
          'Reguli de calcul cu puteri',
          'Compararea puterilor',
          'Scrierea în baza 10. Scrierea în baza 2',
          'Ordinea efectuării operațiilor; utilizarea parantezelor'
        ]
      },
      { // Unit 2
        titles: [
          'Metoda reducerii la unitate',
          'Metoda comparației',
          'Metoda figurativă',
          'Metoda mersului invers',
          'Metoda falsei ipoteze'
        ]
      },
      { // Unit 3
        titles: [
          'Divizibilitatea numerelor naturale',
          'Criterii de divizibilitate',
          'Numere prime. Numere compuse'
        ]
      },
      { // Unit 4
        titles: [
          'Fracții ordinare. Fracții echivalente. Procente',
          'Compararea fracțiilor cu același numitor/numărător',
          'Introducerea și scoaterea întregilor dintr-o fracție',
          'CMMDC. Amplificarea și simplificarea fracțiilor',
          'CMMMC. Aducerea fracțiilor la un numitor comun',
          'Adunarea și scăderea fracțiilor',
          'Înmulțirea fracțiilor',
          'Împărțirea fracțiilor ordinare',
          'Puterea cu exponent natural a unei fracții ordinare',
          'Fracții/procente dintr-un număr natural'
        ]
      },
      { // Unit 5
        titles: [
          'Fracții zecimale; scrierea; transformări',
          'Aproximări; comparare; ordonare; reprezentare pe axa',
          'Adunarea și scăderea fracțiilor zecimale',
          'Înmulțirea fracțiilor zecimale',
          'Împărțirea numerelor; media aritmetică; transformări',
          'Împărțirea fracțiilor zecimale; transformări periodice',
          'Număr rațional pozitiv; ordinea operațiilor',
          'Metode aritmetice cu fracții și unități de măsură',
          'Probleme de organizare a datelor; grafice; statistică'
        ]
      },
      { // Unit 6
        titles: [
          'Punct, dreaptă, plan, semiplan, semidreaptă, segment',
          'Pozițiile relative ale unui punct; colinaritate; drepte',
          'Lungimea unui segment; distanță; congruență',
          'Mijlocul unui segment; simetrie',
          'Unghi: definiție, notații, elemente',
          'Măsura unui unghi; congruență',
          'Clasificarea unghiurilor; calcule',
          'Figuri congruente; axa de simetrie',
          'Unități de măsură pentru lungime; perimetru',
          'Unități de măsură pentru arie; pătrat/dreptunghi',
          'Unități de măsură pentru volum; cub/paralelipiped'
        ]
      }
    ];
    let totalLessons = 0;
    for (let i = 0; i < unitsData.length; i++) {
      const unitData = unitsData[i];
      const unitLessons = lessonsPerUnit[i];
      // Get or create UnitateDeInvatare
      let unitate = await UnitateDeInvatare.findOne({
        name: unitData.name,
        clasaId: clasa._id,
        materieId: materie._id
      });
      if (!unitate) {
        unitate = await UnitateDeInvatare.create({
          name: unitData.name,
          order: unitData.order,
          clasaId: clasa._id,
          materieId: materie._id
        });
        console.log(`\n✓ Created Unitate: ${unitData.name}`);
      } else {
        console.log(`\n✓ Found existing Unitate: ${unitData.name}`);
      }
      // Get or create Capitol (one per unit)
      let capitol = await Capitol.findOne({
        name: unitData.name,
        unitateId: unitate._id
      });
      if (!capitol) {
        capitol = await Capitol.create({
          name: unitData.name,
          order: unitData.order,
          unitateId: unitate._id,
          clasaId: clasa._id,
          materieId: materie._id
        });
        console.log(`  ✓ Created Capitol for ${unitData.name}`);
      }
      // Create lessons for this unit
      for (let j = 0; j < unitLessons.titles.length; j++) {
        const title = unitLessons.titles[j];
        // Check if lesson already exists
        let lectie = await Lectie.findOne({
          summary: title,
          capitolId: capitol._id
        });
        if (!lectie) {
          lectie = await Lectie.create({
            title: `L${j + 1} - ${title}`,
            summary: title,
            content: `Lecția ${j + 1}: ${title}\n\nConținut din Manual Clasa a V-a, Unitatea ${i + 1}`,
            examples: [`Exemplu din lecția ${j + 1}: ${title}`],
            tips: [`Sfat pentru lecția ${j + 1}`],
            capitolId: capitol._id,
            unitateId: unitate._id,
            clasaId: clasa._id,
            materieId: materie._id
          });
          // Create a sample question
          const question = new LectieQuestion({
            lectieId: lectie._id,
            question: `Ce înveți în lecția: ${title}?`,
            answers: [
              { text: `Răspuns corect pentru ${title}`, correct: true },
              { text: 'Răspuns incorect 1', correct: false },
              { text: 'Răspuns incorect 2', correct: false },
              { text: 'Răspuns incorect 3', correct: false }
            ]
          });
          await question.save();
          totalLessons++;
          console.log(`    ✓ L${j + 1}: ${title.substring(0, 40)}...`);
        } else {
          console.log(`    → L${j + 1}: Already exists`);
        }
      }
    }
    console.log('\n' + '='*80);
    console.log('✅ CURRICULUM HIERARCHY CREATION COMPLETE!');
    console.log(`\n📊 Statistics:`);
    console.log(`   Total new lessons created: ${totalLessons}`);
    const allLessons = await Lectie.countDocuments({ materieId: materie._id });
    console.log(`   Total Matematica lessons in database: ${allLessons}`);
    console.log(`\n🎉 Full hierarchy ready!`);
    console.log(`   Materie → Clasa → UnitateDeInvatare → Capitol → Lectii`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Connection error:', err);
  process.exit(1);
});
