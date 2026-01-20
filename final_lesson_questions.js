const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
// Map summaries to lesson-specific questions
const QUESTIONS_MAP = {
  // Matematica
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
  'nmulțirea numerelor naturale': {
    question: 'Care este rezultatul înmulțirii 6 × 8?',
    options: [
      { text: '48', isCorrect: true, explanation: 'Corect! 6 × 8 = 48' },
      { text: '56', isCorrect: false, explanation: 'Incorect. Aceasta ar fi 7 × 8.' },
      { text: '42', isCorrect: false, explanation: 'Incorect. Aceasta ar fi 6 × 7.' },
      { text: '54', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' }
    ]
  },
  'mpărțirea numerelor naturale': {
    question: 'Care este rezultatul împărțirii 56 ÷ 7?',
    options: [
      { text: '8', isCorrect: true, explanation: 'Corect! 56 ÷ 7 = 8' },
      { text: '7', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' },
      { text: '6', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' },
      { text: '9', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' }
    ]
  },
  'Operații cu numere naturale - exerciții': {
    question: 'Calculează: (10 + 5) × 2',
    options: [
      { text: '30', isCorrect: true, explanation: 'Corect! (10 + 5) × 2 = 15 × 2 = 30' },
      { text: '25', isCorrect: false, explanation: 'Incorect. Trebuie sa faci adunarea mai intai.' },
      { text: '20', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' },
      { text: '40', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' }
    ]
  },
  'Puterea unui număr natural': {
    question: 'Care este valoarea lui 2^4 (2 la puterea 4)?',
    options: [
      { text: '16', isCorrect: true, explanation: 'Corect! 2^4 = 2 × 2 × 2 × 2 = 16' },
      { text: '8', isCorrect: false, explanation: 'Incorect. 2^3 = 8, nu 2^4.' },
      { text: '32', isCorrect: false, explanation: 'Incorect. 2^5 = 32, nu 2^4.' },
      { text: '6', isCorrect: false, explanation: 'Incorect. Calculeaza 2 × 2 × 2 × 2.' }
    ]
  },
  'Ordinea efectuării operațiilor': {
    question: 'Care este rezultatul: 2 + 3 × 4?',
    options: [
      { text: '14', isCorrect: true, explanation: 'Corect! Inmultirile se fac inaintea adunarii: 3 × 4 = 12, apoi 2 + 12 = 14' },
      { text: '20', isCorrect: false, explanation: 'Incorect. Nu se calculeaza de la stanga la dreapta.' },
      { text: '11', isCorrect: false, explanation: 'Incorect. Trebuie sa respecti ordinea operatiilor.' },
      { text: '5', isCorrect: false, explanation: 'Incorect. Trebuie sa faci inmultirea inaintea adunarii.' }
    ]
  },
  'Probleme cu numere naturale': {
    question: 'Andrei are 15 mere. Mama ii mai da 8. Cate mere are acum?',
    options: [
      { text: '23', isCorrect: true, explanation: 'Corect! 15 + 8 = 23' },
      { text: '20', isCorrect: false, explanation: 'Incorect. Aduna din nou.' },
      { text: '25', isCorrect: false, explanation: 'Incorect. Aduna din nou.' },
      { text: '30', isCorrect: false, explanation: 'Incorect. Calculeaza mai atent.' }
    ]
  },
  'Descompunerea n factori primi': {
    question: 'Care este descompunerea în factori primi a numărului 12?',
    options: [
      { text: '2² × 3', isCorrect: true, explanation: 'Corect! 12 = 2 × 2 × 3' },
      { text: '2 × 6', isCorrect: false, explanation: 'Incorect. 6 nu este prim.' },
      { text: '3 × 4', isCorrect: false, explanation: 'Incorect. 4 nu este prim.' },
      { text: '2 × 5', isCorrect: false, explanation: 'Incorect. Aceasta este descompunerea lui 10.' }
    ]
  },
  // Limba Română (mislabeled as Matematica)
  'Comunicare orală și redactare': {
    question: 'Care sunt tipurile principale de comunicare orală?',
    options: [
      { text: 'Conversația, expunerea și dialogul', isCorrect: true, explanation: 'Corect! Acestea sunt principalele forme de comunicare orală.' },
      { text: 'Doar scrisul', isCorrect: false, explanation: 'Incorect. Aceasta este comunicare scrisa.' },
      { text: 'Doar gesturile', isCorrect: false, explanation: 'Incorect. Aceasta este comunicare non-verbala.' },
      { text: 'Doar cititul', isCorrect: false, explanation: 'Incorect. Cititul nu este comunicare orala.' }
    ]
  },
  'Textul narativ și descriptiv': {
    question: 'Care este diferența dintre textul narativ și cel descriptiv?',
    options: [
      { text: 'Textul narativ povestește o întâmplare, descriptivul descrie o situație', isCorrect: true, explanation: 'Corect! Aceasta este diferența principală.' },
      { text: 'Sunt aceleași', isCorrect: false, explanation: 'Incorect. Au scopuri diferite.' },
      { text: 'Textul descriptiv povestește', isCorrect: false, explanation: 'Incorect. Descriptivul descrie.' },
      { text: 'Nu au diferență', isCorrect: false, explanation: 'Incorect. Au caracteristici diferite.' }
    ]
  },
  'Textul dialogat și alte forme de expresie': {
    question: 'Ce este un dialog?',
    options: [
      { text: 'O conversație între doi sau mai mulți personaje', isCorrect: true, explanation: 'Corect! Dialogul este o formă de exprimare a convorbirii.' },
      { text: 'O narațiune lungă', isCorrect: false, explanation: 'Incorect. Dialogul nu este narațiune.' },
      { text: 'O descriere', isCorrect: false, explanation: 'Incorect. Dialogul nu este descriere.' },
      { text: 'Un vers', isCorrect: false, explanation: 'Incorect. Dialogul poate fi în proză.' }
    ]
  },
  // Real Limba Română
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
};
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Creating final lesson-specific questions...\n');
  try {
    const allLessons = await Lectie.find({
      $or: [
        { materieId: '696def9709bb56258f6ede84' },
        { materieId: '696def9809bb56258f6ede85' }
      ]
    });
    let fixed = 0;
    let notFound = 0;
    for (const lesson of allLessons) {
      const questionData = QUESTIONS_MAP[lesson.summary];
      if (questionData) {
        const question = await LectieQuestion.findOne({ lectieId: lesson._id });
        if (question) {
          question.question = questionData.question;
          question.options = questionData.options;
          await question.save();
          fixed++;
          console.log(`✅ ${lesson.title} (${lesson.summary.substring(0, 40)}...)`);
        }
      } else {
        notFound++;
      }
    }
    console.log(`\n════════════════════════════════════════════════════════════`);
    console.log(`✅ Fixed ${fixed} lessons with proper questions`);
    console.log(`⚠️  Lessons without mapping: ${notFound}`);
    console.log(`✅ Total processed: ${fixed + notFound} lessons`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
