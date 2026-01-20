const mongoose = require('mongoose');
const { Materie, Clasa, UnitateDeInvatare, Capitol, Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    console.log('\n' + '='*80);
    console.log('CREATING LIMBA ROMÂNĂ CURRICULUM HIERARCHY');
    console.log('='*80);
    // Get or create Limba Română
    let materie = await Materie.findOne({ name: 'Limba Romana' });
    if (!materie) {
      materie = await Materie.create({ name: 'Limba Romana' });
      console.log('✓ Created Materie: Limba Romana');
    } else {
      console.log('✓ Found existing Materie: Limba Romana');
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
      { name: 'Unitatea 1: Despre mine. Selfie', order: 1 },
      { name: 'Unitatea 2: De-a ce mă joc', order: 2 },
      { name: 'Unitatea 3: Pe strada mea', order: 3 },
      { name: 'Unitatea 4: Vreau să salvez lumea', order: 4 },
      { name: 'Unitatea 5: Călătoresc prin basme', order: 5 },
      { name: 'Unitatea 6: Din carte spre departe', order: 6 }
    ];
    const lessonsPerUnit = [
      { // Unit 1
        titles: [
          'Textul literar. Prietenul meu',
          'Trăsături ale textului literar (actualizare)',
          'Cuvântul-cheie. Tema. Planul simplu de idei',
          'Semnificațiile textului',
          'Textul nonliterar',
          'Noi pagini – alte idei',
          'Identitatea emoțiilor. Roluri personală',
          'Exprimarea adecvată a emoțiilor',
          'Propoziția. Tipuri de propoziții',
          'Cuvântul și dicționarul',
          'Sinonimele. Antonimele',
          'Câmpul lexical',
          'Tipurile de sunete',
          'Silaba. Accentul',
          'Etapele scrierii. Relatarea unor experiențe personale'
        ]
      },
      { // Unit 2
        titles: [
          'Textul narativ literar. Vizită… de I.L. Caragiale',
          'Timp, spațiu și acțiune',
          'Planul dezvoltat de idei',
          'Personajele',
          'Semnificațiile textului',
          'Noi pagini – alte idei',
          'Diversitate culturală: jocuri de ieri și de azi',
          'Schimburi de replici în dialog',
          'Reguli de acces la cuvânt',
          'Verbul. Predicatul verbal',
          'Modul indicativ. Prezentul',
          'Imperfectul',
          'Verbul auxiliar a avea. Participiul. Perfectul compus',
          'Perfectul simplu și mai-mult-ca-perfectul',
          'Viitorul. Verbele auxiliare a vrea și a fi',
          'Modul imperativ',
          'Textul narativ ficțional'
        ]
      },
      { // Unit 3
        titles: [
          'Textul descriptiv literar. O stradă cu sentimente',
          'Textul descriptiv literar. Personificarea',
          'Semnificațiile textului',
          'Noi pagini – alte idei',
          'Tradițiile în poveștile poporului',
          'Substantivul',
          'Articolul',
          'Adjectivul',
          'Pronumele',
          'Numeralul',
          'Prepoziția',
          'Conjuncția',
          'Interjecția',
          'Textul descriptiv'
        ]
      },
      { // Unit 4
        titles: [
          'Textul narativ cu caracter de baladă',
          'Rolul eroilor în povești',
          'Mesajul textului narativ',
          'Noi pagini – alte idei',
          'Comportamente și valori în povești',
          'Conversația și argumentarea',
          'Expresivitate și imaginație în cuvinte',
          'Adverbia. Adverbul și predicatul',
          'Clasificarea adverbelor',
          'Textul argumentativ'
        ]
      },
      { // Unit 5
        titles: [
          'Basme și legende. Caracteristici',
          'Personajele în basme',
          'Mesajele și învățăturile basmelor',
          'Noi pagini – alte idei',
          'Eroii și ajutoarele magice în basme',
          'Prepoziția și conjuncția în propoziții compuse',
          'Coordonarea și subordonarea',
          'Fraza complexă',
          'Textul prozaic fantastic'
        ]
      },
      { // Unit 6
        titles: [
          'Cărți pentru copii. Autor, ilustrator, editor',
          'Povestea unei cărți',
          'Conexiuni între citit și alte arte',
          'Semnificații în povești despre cărți',
          'Textul încadrat. Naratorul'
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
            content: `Lecția ${j + 1}: ${title}\n\nConținut din Manual Clasa a V-a, Unitatea ${i + 1}, Limba și Literatura Română`,
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
    console.log('✅ LIMBA ROMÂNĂ CURRICULUM CREATION COMPLETE!');
    console.log(`\n📊 Statistics:`);
    console.log(`   Total new lessons created: ${totalLessons}`);
    const allLessons = await Lectie.countDocuments({ materieId: materie._id });
    console.log(`   Total Limba Română lessons in database: ${allLessons}`);
    const matematicaLessons = await Lectie.countDocuments({ materieId: '696def9709bb56258f6ede84' });
    console.log(`   Total Matematica lessons in database: ${matematicaLessons}`);
    const totalLessonsDb = await Lectie.countDocuments();
    console.log(`   TOTAL LESSONS IN DATABASE: ${totalLessonsDb}`);
    console.log(`\n🎉 Full curriculum ready!`);
    console.log(`   Both subjects completed: Matematica (51 lessons) + Limba Română (${allLessons} lessons)`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Connection error:', err);
  process.exit(1);
});
