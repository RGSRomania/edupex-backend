const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
require('dotenv').config();
const REMAINING_QUESTIONS = {
  'nmulțirea numerelor naturale': {
    question: 'Care este rezultatul înmulțirii 7 × 9?',
    options: [
      { text: '63', isCorrect: true, explanation: 'Corect! 7 × 9 = 63' },
      { text: '70', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' },
      { text: '56', isCorrect: false, explanation: 'Incorect. Aceasta ar fi 7 × 8.' },
      { text: '72', isCorrect: false, explanation: 'Incorect. Aceasta ar fi 8 × 9.' }
    ]
  },
  'mpărțirea numerelor naturale': {
    question: 'Care este rezultatul împărțirii 72 ÷ 8?',
    options: [
      { text: '9', isCorrect: true, explanation: 'Corect! 72 ÷ 8 = 9' },
      { text: '8', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' },
      { text: '10', isCorrect: false, explanation: 'Incorect. Calculeaza din nou.' },
      { text: '6', isCorrect: false, explanation: 'Incorect. Aceasta ar fi 48 ÷ 8.' }
    ]
  },
  'Descompunerea n factori primi': {
    question: 'Care este descompunerea în factori primi a numărului 18?',
    options: [
      { text: '2 × 3²', isCorrect: true, explanation: 'Corect! 18 = 2 × 3 × 3 = 2 × 3²' },
      { text: '3 × 6', isCorrect: false, explanation: 'Incorect. 6 nu este prim.' },
      { text: '2 × 9', isCorrect: false, explanation: 'Incorect. 9 nu este prim.' },
      { text: '18', isCorrect: false, explanation: 'Incorect. 18 nu este prim.' }
    ]
  },
  'Cuvntul și clasificarea cuvintelor': {
    question: 'Cum se clasifică cuvintele în limba română?',
    options: [
      { text: 'După sens (lexicale și gramaticale)', isCorrect: true, explanation: 'Corect! Aceasta este clasificarea de bază a cuvintelor.' },
      { text: 'Doar după lungime', isCorrect: false, explanation: 'Incorect. Lungimea nu determină tipul cuvintelor.' },
      { text: 'Doar după sunet', isCorrect: false, explanation: 'Incorect. Nu se clasifică după sunet.' },
      { text: 'Nu se pot clasifica', isCorrect: false, explanation: 'Incorect. Cuvintele se clasifică.' }
    ]
  },
  'Comunicare și limbă - procesul comunicării': {
    question: 'Care este scopul principal al comunicării?',
    options: [
      { text: 'Schimbul de informații și idei', isCorrect: true, explanation: 'Corect! Comunicarea servește să transmitem mesaje.' },
      { text: 'Doar vorbitul', isCorrect: false, explanation: 'Incorect. Comunicarea nu este doar vorbire.' },
      { text: 'Doar ascultatul', isCorrect: false, explanation: 'Incorect. Comunicarea este bidirecțională.' },
      { text: 'Nu are scop', isCorrect: false, explanation: 'Incorect. Comunicarea are rol important.' }
    ]
  },
  'Ortografia și punctuația': {
    question: 'Care sunt principalele semne de punctuație în limba română?',
    options: [
      { text: 'Punctul, virgula, punctul și virgula, două puncte, punctul de exclamare, semnul întrebării', isCorrect: true, explanation: 'Corect! Acestea sunt semnele principale de punctuație.' },
      { text: 'Doar punctul', isCorrect: false, explanation: 'Incorect. Sunt mai multe semne.' },
      { text: 'Doar virgula', isCorrect: false, explanation: 'Incorect. Sunt mai multe semne.' },
      { text: 'Nu sunt semne de punctuație', isCorrect: false, explanation: 'Incorect. Punctuația există.' }
    ]
  },
  'Verbul și conjugarea acestuia': {
    question: 'Cum se conjugă verbul "a fi" în prezent?',
    options: [
      { text: 'sunt, ești, este, suntem, sunteți, sunt', isCorrect: true, explanation: 'Corect! Aceasta este conjugarea corectă în prezent.' },
      { text: 'eram, erai, era...', isCorrect: false, explanation: 'Incorect. Aceasta este conjugarea în imperfect.' },
      { text: 'voi fi, vei fi, va fi...', isCorrect: false, explanation: 'Incorect. Aceasta este conjugarea în viitor.' },
      { text: 'nu se poate conjuga', isCorrect: false, explanation: 'Incorect. Verbul "a fi" se conjugă.' }
    ]
  },
  'Adjectivul și gradul acestuia': {
    question: 'Care sunt gradele adjectivului?',
    options: [
      { text: 'Gradul pozitiv, comparativ și superlativ', isCorrect: true, explanation: 'Corect! Adjectivele au trei grade.' },
      { text: 'Doar gradul pozitiv', isCorrect: false, explanation: 'Incorect. Sunt mai multe grade.' },
      { text: 'Doar gradul comparativ', isCorrect: false, explanation: 'Incorect. Sunt mai multe grade.' },
      { text: 'Nu au grade', isCorrect: false, explanation: 'Incorect. Adjectivele au grade.' }
    ]
  },
  'Pronumele și clasificarea acestuia': {
    question: 'Care sunt tipurile principale de pronume?',
    options: [
      { text: 'Personale, posesive, demonstrative, relative, interogative, nedefinite', isCorrect: true, explanation: 'Corect! Acestea sunt principalele tipuri de pronume.' },
      { text: 'Doar pronumele personale', isCorrect: false, explanation: 'Incorect. Sunt mai multe tipuri.' },
      { text: 'Doar pronumele posesive', isCorrect: false, explanation: 'Incorect. Sunt mai multe tipuri.' },
      { text: 'Nu există tipuri de pronume', isCorrect: false, explanation: 'Incorect. Pronumele se clasifică.' }
    ]
  },
  'Textul și structura acestuia': {
    question: 'Din ce este alcătuit un text bine structurat?',
    options: [
      { text: 'Introducere, dezvoltare și încheiere', isCorrect: true, explanation: 'Corect! Aceasta este structura de bază a unui text.' },
      { text: 'Doar cuvinte aleatoare', isCorrect: false, explanation: 'Incorect. Textul trebuie organizat.' },
      { text: 'Doar cuvinte lungi', isCorrect: false, explanation: 'Incorect. Lungimea nu determină structura.' },
      { text: 'Nu are structură', isCorrect: false, explanation: 'Incorect. Orice text bun are structură.' }
    ]
  }
};
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Fixing remaining lessons...\n');
  try {
    const allLessons = await Lectie.find({
      $or: [
        { materieId: '696def9709bb56258f6ede84' },
        { materieId: '696def9809bb56258f6ede85' }
      ]
    });
    let fixed = 0;
    for (const lesson of allLessons) {
      const questionData = REMAINING_QUESTIONS[lesson.summary];
      if (questionData) {
        const question = await LectieQuestion.findOne({ lectieId: lesson._id });
        if (question) {
          question.question = questionData.question;
          question.options = questionData.options;
          await question.save();
          fixed++;
          console.log(`✅ ${lesson.title}: ${questionData.question}`);
        }
      }
    }
    console.log(`\n════════════════════════════════════════════════════════════`);
    console.log(`✅ Fixed ${fixed} remaining lessons`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
