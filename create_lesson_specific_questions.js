const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
// Define lesson-specific questions that match the actual lesson content
const LESSON_SPECIFIC_QUESTIONS = {
  'Numere naturale și operații fundamentale': {
    question: 'Care sunt primele zece numere naturale în ordine crescătoare?',
    options: [
      { text: '0, 1, 2, 3, 4, 5, 6, 7, 8, 9', isCorrect: true, explanation: 'Corect! Numerele naturale incep de la 0.' },
      { text: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10', isCorrect: false, explanation: 'Incorect. Seria incepe de la 0.' },
      { text: '1, 3, 5, 7, 9, 11, 13, 15, 17, 19', isCorrect: false, explanation: 'Incorect. Acestea sunt doar numerele impare.' },
      { text: '2, 4, 6, 8, 10, 12, 14, 16, 18, 20', isCorrect: false, explanation: 'Incorect. Acestea sunt doar numerele pare.' }
    ]
  },
  'Adunarea și scăderea numerelor naturale': {
    question: 'Dacă aduni 15 + 27, care este rezultatul?',
    options: [
      { text: '42', isCorrect: true, explanation: 'Corect! 15 + 27 = 42' },
      { text: '40', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' },
      { text: '45', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' },
      { text: '35', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' }
    ]
  },
  'Înmulțirea numerelor naturale': {
    question: 'Care este rezultatul înmulțirii 6 × 8?',
    options: [
      { text: '48', isCorrect: true, explanation: 'Corect! 6 × 8 = 48' },
      { text: '56', isCorrect: false, explanation: 'Incorect. Aceasta ar fi 7 × 8.' },
      { text: '42', isCorrect: false, explanation: 'Incorect. Aceasta ar fi 6 × 7.' },
      { text: '54', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' }
    ]
  },
  'Împărțirea numerelor naturale': {
    question: 'Care este rezultatul împărțirii 56 ÷ 7?',
    options: [
      { text: '8', isCorrect: true, explanation: 'Corect! 56 ÷ 7 = 8' },
      { text: '7', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' },
      { text: '6', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' },
      { text: '9', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' }
    ]
  },
  'Ordinea efectuării operațiilor': {
    question: 'Care este rezultatul: 2 + 3 × 4?',
    options: [
      { text: '14', isCorrect: true, explanation: 'Corect! Inmultirile se fac inaintea adunarii: 3 × 4 = 12, apoi 2 + 12 = 14' },
      { text: '20', isCorrect: false, explanation: 'Incorect. Nu se calculeaza de la stanga la dreapta pentru toate operatiile.' },
      { text: '11', isCorrect: false, explanation: 'Incorect. Trebuie sa respecti ordinea operatiilor.' },
      { text: '5', isCorrect: false, explanation: 'Incorect. Trebuie sa faci inmultirea inaintea adunarii.' }
    ]
  },
  'Puteri cu exponent natural': {
    question: 'Care este valoarea lui 2^4 (2 la puterea 4)?',
    options: [
      { text: '16', isCorrect: true, explanation: 'Corect! 2^4 = 2 × 2 × 2 × 2 = 16' },
      { text: '8', isCorrect: false, explanation: 'Incorect. 2^3 = 8, nu 2^4.' },
      { text: '32', isCorrect: false, explanation: 'Incorect. 2^5 = 32, nu 2^4.' },
      { text: '6', isCorrect: false, explanation: 'Incorect. Calculeaza 2 × 2 × 2 × 2.' }
    ]
  },
  'Numere prime și numere compuse': {
    question: 'Care dintre urmatoarele numere este prim?',
    options: [
      { text: '17', isCorrect: true, explanation: 'Corect! 17 are doar doi divizori: 1 si 17.' },
      { text: '15', isCorrect: false, explanation: 'Incorect. 15 = 3 × 5, deci este compus.' },
      { text: '20', isCorrect: false, explanation: 'Incorect. 20 = 4 × 5, deci este compus.' },
      { text: '12', isCorrect: false, explanation: 'Incorect. 12 = 2 × 6, deci este compus.' }
    ]
  },
  'Fracții ordinare': {
    question: 'Care este valoarea fracției 3/4?',
    options: [
      { text: '0,75', isCorrect: true, explanation: 'Corect! 3 ÷ 4 = 0,75' },
      { text: '0,34', isCorrect: false, explanation: 'Incorect. Calculeaza 3 ÷ 4.' },
      { text: '1,33', isCorrect: false, explanation: 'Incorect. Aceasta ar fi 4 ÷ 3.' },
      { text: '1,5', isCorrect: false, explanation: 'Incorect. Aceasta ar fi 3 ÷ 2.' }
    ]
  },
  'Fracții zecimale': {
    question: 'Transformă fracția zecimală 0,5 în fracție ordinară.',
    options: [
      { text: '1/2', isCorrect: true, explanation: 'Corect! 0,5 = 1/2' },
      { text: '1/5', isCorrect: false, explanation: 'Incorect. 1/5 = 0,2.' },
      { text: '5/10', isCorrect: false, explanation: 'Incorect, dar echivalent. Forma simplificata este 1/2.' },
      { text: '2/5', isCorrect: false, explanation: 'Incorect. 2/5 = 0,4.' }
    ]
  },
  'Punct, dreaptă, plan': {
    question: 'Care este diferența dintre o dreaptă și un segment?',
    options: [
      { text: 'Dreapta este infinită, segmentul are două capete', isCorrect: true, explanation: 'Corect! Dreapta nu se termina nicaieri, segmentul are puncte de sfarsit.' },
      { text: 'Sunt aceleași', isCorrect: false, explanation: 'Incorect. Au proprietati diferite.' },
      { text: 'Dreapta este mai scurtă', isCorrect: false, explanation: 'Incorect. Dreapta este infinită.' },
      { text: 'Segmentul este mai lung', isCorrect: false, explanation: 'Incorect. Nu se compara lungimile asa.' }
    ]
  },
  'Unghiuri': {
    question: 'Ce unghi are o măsură de 90 de grade?',
    options: [
      { text: 'Unghi drept', isCorrect: true, explanation: 'Corect! Unghiul drept măsoară exact 90°.' },
      { text: 'Unghi ascuțit', isCorrect: false, explanation: 'Incorect. Unghiul ascuțit măsoară mai puțin de 90°.' },
      { text: 'Unghi obtuz', isCorrect: false, explanation: 'Incorect. Unghiul obtuz măsoară mai mult de 90°.' },
      { text: 'Unghi plat', isCorrect: false, explanation: 'Incorect. Unghiul plat măsoară 180°.' }
    ]
  },
};
const LIMBA_SPECIFIC_QUESTIONS = {
  'Comunicare și limba - procesul comunicării': {
    question: 'Care sunt elementele esențiale ale procesului de comunicare?',
    options: [
      { text: 'Emițător, receptor, mesaj, canal și context', isCorrect: true, explanation: 'Corect! Acestea sunt cei 5 elemente fundamentale.' },
      { text: 'Doar emițător și receptor', isCorrect: false, explanation: 'Incorect. Sunt mai multi factori implicati.' },
      { text: 'Doar mesajul', isCorrect: false, explanation: 'Incorect. Comunicarea necesita mai multi elemente.' },
      { text: 'Doar contextul', isCorrect: false, explanation: 'Incorect. Contextul este important dar nu singur.' }
    ]
  },
  'Sunetele limbii - pronunția și ortografia': {
    question: 'Limba română are câte sunete principale?',
    options: [
      { text: '25 de sunete (foneme)', isCorrect: true, explanation: 'Corect! Limba română are 25 de sunete distincte.' },
      { text: '26 de sunete', isCorrect: false, explanation: 'Incorect. Aceasta este numarul de litere din alfabetul englez.' },
      { text: '24 de sunete', isCorrect: false, explanation: 'Incorect. Limba română are 25 de sunete.' },
      { text: '30 de sunete', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' }
    ]
  },
  'Cuvântul și clasificare': {
    question: 'Ce este un cuvânt?',
    options: [
      { text: 'Unitatea limbajului cu formă și semnificație', isCorrect: true, explanation: 'Corect! Cuvantul este unitatea de baza a limbii.' },
      { text: 'Doar o litera', isCorrect: false, explanation: 'Incorect. O litera nu este cuvant.' },
      { text: 'Un sunet', isCorrect: false, explanation: 'Incorect. Un sunet nu este cuvant.' },
      { text: 'O propoziție', isCorrect: false, explanation: 'Incorect. O propozitie este mai complexa.' }
    ]
  },
  'Părți de vorbire': {
    question: 'Care este partea de vorbire a cuvântului "frumos"?',
    options: [
      { text: 'Adjectiv', isCorrect: true, explanation: 'Corect! "Frumos" este un adjectiv care descrie o calitate.' },
      { text: 'Substantiv', isCorrect: false, explanation: 'Incorect. Substantivele numesc obiecte sau fiinte.' },
      { text: 'Verb', isCorrect: false, explanation: 'Incorect. Verbele exprima actiuni.' },
      { text: 'Adverb', isCorrect: false, explanation: 'Incorect. Adverbele modifica verbele, nu sunt calitati.' }
    ]
  },
  'Propoziția': {
    question: 'Ce este o propoziție?',
    options: [
      { text: 'Unitate de limbă cu subiect și predicat', isCorrect: true, explanation: 'Corect! Propozitia trebuie sa aiba subiect si predicat.' },
      { text: 'Un cuvânt', isCorrect: false, explanation: 'Incorect. Un cuvant nu formeaza o propozitie.' },
      { text: 'O litera', isCorrect: false, explanation: 'Incorect. Literele nu formeaza propozitii.' },
      { text: 'Un sunet', isCorrect: false, explanation: 'Incorect. Un sunet nu este propozitie.' }
    ]
  },
  'Propoziții complexe': {
    question: 'Cum se unesc două propoziții simple pentru a forma o propoziție complexă?',
    options: [
      { text: 'Prin conjuncții și subordonate', isCorrect: true, explanation: 'Corect! Conjunctiile unesc propozitii intr-o structura complexa.' },
      { text: 'Prin adăugarea de spații', isCorrect: false, explanation: 'Incorect. Spatiile nu unesc propozitiile.' },
      { text: 'Prin ștergerea unor cuvinte', isCorrect: false, explanation: 'Incorect. Nu se sterg cuvinte.' },
      { text: 'Nu se pot uni', isCorrect: false, explanation: 'Incorect. Propozitiile se pot uni.' }
    ]
  },
  'Redactarea de texte': {
    question: 'Care sunt părțile principale ale unui text bine structurat?',
    options: [
      { text: 'Introducere, dezvoltare și încheiere', isCorrect: true, explanation: 'Corect! Acestea sunt structurile de baza ale unui text.' },
      { text: 'Doar titlu', isCorrect: false, explanation: 'Incorect. Un text necesita mai mult.' },
      { text: 'Doar cuvinte aleatorii', isCorrect: false, explanation: 'Incorect. Textul trebuie structurat.' },
      { text: 'Doar punctuație', isCorrect: false, explanation: 'Incorect. Textul are si continut.' }
    ]
  },
  'Textele literare': {
    question: 'Cum se analizează un text literar?',
    options: [
      { text: 'Prin identificarea temei, genului și figurilor de stil', isCorrect: true, explanation: 'Corect! Acestea sunt principalele elemente de analiza.' },
      { text: 'Doar prin citire rapidă', isCorrect: false, explanation: 'Incorect. Analiza necesita o lectură atentă.' },
      { text: 'Nu se pot analiza', isCorrect: false, explanation: 'Incorect. Textele literare se pot analiza.' },
      { text: 'Doar prin numărarea cuvintelor', isCorrect: false, explanation: 'Incorect. Analiza este mai profunda.' }
    ]
  },
  'Genuri literare': {
    question: 'Care sunt principalele genuri literare?',
    options: [
      { text: 'Lirica, epica și drama', isCorrect: true, explanation: 'Corect! Acestea sunt cele trei genuri literare fundamentale.' },
      { text: 'Doar proza', isCorrect: false, explanation: 'Incorect. Sunt mai multe genuri.' },
      { text: 'Doar versuri', isCorrect: false, explanation: 'Incorect. Versurile sunt parte din lirica.' },
      { text: 'Doar narațiune', isCorrect: false, explanation: 'Incorect. Sunt mai multe forme.' }
    ]
  },
  'Versuri și rimă': {
    question: 'Ce este un vers?',
    options: [
      { text: 'O succesiune de cuvinte cu ritm și rimă', isCorrect: true, explanation: 'Corect! Versurile sunt unitatea de baza a poeziei.' },
      { text: 'Doar o litera', isCorrect: false, explanation: 'Incorect. Un vers este mai complex.' },
      { text: 'Un sunet', isCorrect: false, explanation: 'Incorect. Un vers contine mai multe sunete.' },
      { text: 'Un cuvânt', isCorrect: false, explanation: 'Incorect. Un vers are mai multe cuvinte.' }
    ]
  },
  'Figuri de stil': {
    question: 'Care sunt exemple de figuri de stil?',
    options: [
      { text: 'Metafora, comparație, personificare, hiperbola', isCorrect: true, explanation: 'Corect! Acestea sunt figuri de stil comune.' },
      { text: 'Doar rima', isCorrect: false, explanation: 'Incorect. Rima nu este figura de stil.' },
      { text: 'Doar ritm', isCorrect: false, explanation: 'Incorect. Ritmul nu este figura de stil.' },
      { text: 'Nu există figuri de stil', isCorrect: false, explanation: 'Incorect. Figurile de stil sunt numeroase.' }
    ]
  },
};
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Creating lesson-specific questions...\n');
  try {
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' });
    let matFixed = 0;
    let limbaFixed = 0;
    // Fix Matematica questions
    console.log('=== FIXING MATEMATICA QUESTIONS ===\n');
    for (const lesson of matLessons) {
      const questionData = LESSON_SPECIFIC_QUESTIONS[lesson.summary];
      if (questionData) {
        const question = await LectieQuestion.findOne({ lectieId: lesson._id });
        if (question) {
          question.question = questionData.question;
          question.options = questionData.options;
          await question.save();
          matFixed++;
          console.log(`✅ ${lesson.title}: ${questionData.question}`);
        }
      }
    }
    // Fix Limba Română questions
    console.log('\n=== FIXING LIMBA ROMANA QUESTIONS ===\n');
    for (const lesson of limbaLessons) {
      const questionData = LIMBA_SPECIFIC_QUESTIONS[lesson.summary];
      if (questionData) {
        const question = await LectieQuestion.findOne({ lectieId: lesson._id });
        if (question) {
          question.question = questionData.question;
          question.options = questionData.options;
          await question.save();
          limbaFixed++;
          console.log(`✅ ${lesson.title}: ${questionData.question}`);
        }
      }
    }
    console.log(`\n════════════════════════════════════════════════════════════`);
    console.log(`✅ Fixed ${matFixed} Matematica lesson-specific questions`);
    console.log(`✅ Fixed ${limbaFixed} Limba Română lesson-specific questions`);
    console.log(`✅ Total fixed: ${matFixed + limbaFixed} lessons`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
