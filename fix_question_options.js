const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('./models/Lesson');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
// Define proper answer options for each lesson
const MATH_OPTIONS = {
  'L1': {
    correct: 'Numerele naturale se scriu și se citesc de la stânga la dreapta',
    incorrect: ['Numerele naturale se scriu în ordine inversă', 'Se folosesc doar cifre romane', 'Numerele naturale nu au o ordine standard']
  },
  'L2': {
    correct: 'Drepte concurente (care se intersectează) și drepte paralele (care nu se intersectează)',
    incorrect: ['Doar drepte paralele', 'Doar drepte care se intersectează', 'Drepte perpendiculare și orizontale']
  },
  'L3': {
    correct: 'Se măsoară cu rigla sau compasul, distanța dintre capete',
    incorrect: ['Se măsoară cu transportorul', 'Se calculează din ochi', 'Se nu se poate măsura']
  },
  'L4': {
    correct: 'Comutativă, asociativă și element neutru (0)',
    incorrect: ['Doar comutativă', 'Doar asociativă', 'Nu are proprietăți']
  },
  'L5': {
    correct: 'O adunare repetată de același număr',
    incorrect: ['O scădere repetată', 'O împărțire repetată', 'O operație aleatorie']
  },
  'L6': {
    correct: 'Înmulțiri și împărțiri se fac înainte de adunări și scăderi',
    incorrect: ['Adunările se fac mereu primele', 'Nu contează ordinea', 'Scăderile se fac mereu primele']
  },
  'L7': {
    correct: 'Puterea cu exponent natural este produsul bazei cu ea însăși exponenatul de ori',
    incorrect: ['Puterea este baza plus exponentul', 'Puterea este baza minus exponentul', 'Puterea este mereu 1']
  },
  'L8': {
    correct: 'Numerele prime au doar 2 divizori (1 și el însuși), numerele compuse au mai mulți',
    incorrect: ['Numerele prime sunt mai mari decât cele compuse', 'Sunt același lucru', 'Numerele prime sunt pari']
  },
  'L9': {
    correct: 'Se divide succesiv la numere prime până se obține 1',
    incorrect: ['Se divide la 10 până se termină', 'Se adună numerele', 'Nu se poate descompune']
  },
  'L10': {
    correct: 'Cel mai mare număr care divide ambele numere',
    incorrect: ['Cel mai mic multiplu comun', 'Suma numerelor', 'Diferența numerelor']
  },
  'L11': {
    correct: 'Se adună număratorii și se păstrează numitorul',
    incorrect: ['Se adună și număratorii și numitorii', 'Se înmulțesc fracțiile', 'Se scad numeratorii']
  },
  'L12': {
    correct: 'Se efectuează împărțirea și se obține zecimala sau se amplifica/simplifica',
    incorrect: ['Se înmulțesc numerele', 'Nu se pot transforma', 'Se pune doar virgula']
  },
  'L13': {
    correct: 'Adunare, scădere, înmulțire și împărțire cu reguli specifice fracțiilor',
    incorrect: ['Aceleași ca la numere naturale', 'Nu se pot efectua operații', 'Doar adunare și scădere']
  },
};
const LIMBA_OPTIONS = {
  'L1': {
    correct: 'Emițător, receptor, mesaj, canal și context',
    incorrect: ['Doar emițător și receptor', 'Doar mesaj și context', 'Doar canalul']
  },
  'L2': {
    correct: 'Vocale (a, e, i, o, u) și consoane (b, c, d, f, etc.)',
    incorrect: ['Doar vocale', 'Doar consoane', 'Doar literele mari']
  },
  'L3': {
    correct: 'Unitatea limbajului cu formă și semnificație; se clasifică în lexicale și gramaticale',
    incorrect: ['Unitatea de scris', 'Unitatea de pronunție', 'Unitatea de citire']
  },
  'L4': {
    correct: 'Substantiv, adjectiv, verb, adverb, prepoziție, conjuncție, articol, pronume',
    incorrect: ['Doar substantivele și adjectivele', 'Doar verbele', 'Doar cuvintele lungi']
  },
  'L5': {
    correct: 'Unitate de limbă cu subiect și predicat; are structură bine definită',
    incorrect: ['Un singur cuvânt', 'O mulțime de cuvinte aleatoare', 'Doar o ordine de cuvinte']
  },
  'L6': {
    correct: 'Prin subordonate și coordinate, folosind conjuncții și semne de punctuație',
    incorrect: ['Doar cu propoziții simple', 'Aleator', 'Fără reguli']
  },
  'L7': {
    correct: 'Descrierea, narațiunea și dialogul sunt principalele metode',
    incorrect: ['Doar descrierea', 'Doar narațiunea', 'Doar dialogul']
  },
  'L8': {
    correct: 'Introducere, dezvoltare și încheiere, cu coerenție și coeziune',
    incorrect: ['Fără ordine anume', 'Doar dezvoltare', 'Aleator']
  },
  'L9': {
    correct: 'Prin analiză literară, identificând tema, genul, figurile de stil',
    incorrect: ['Doar prin citire rapidă', 'Nu se pot analiza', 'Doar prin rezumare']
  },
  'L10': {
    correct: 'Lirica, epica, drama și alte genuri fundamentale',
    incorrect: ['Doar lirica', 'Doar epica', 'Doar proza']
  },
  'L11': {
    correct: 'O succesiune de versuri aranjate într-o ordine cu ritm și rimă',
    incorrect: ['Doar o serie de cuvinte', 'Nu are tipuri', 'Doar versurile lungi']
  },
  'L12': {
    correct: 'Metafora, comparație, personificare, hiperbola și altele',
    incorrect: ['Nu există figuri de stil', 'Doar rima și ritm', 'Doar aliterația']
  },
};
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Fixing all question options...\n');
  try {
    const matLessons = await Lectie.find({ materieId: '696def9709bb56258f6ede84' });
    const limbaLessons = await Lectie.find({ materieId: '696def9809bb56258f6ede85' });
    let matFixed = 0;
    let limbaFixed = 0;
    // Fix Matematica questions
    for (const lesson of matLessons) {
      const match = lesson.title.match(/L(\d+)/);
      if (match) {
        const lessonNum = `L${match[1]}`;
        const options = MATH_OPTIONS[lessonNum];
        if (options) {
          const question = await LectieQuestion.findOne({ lectieId: lesson._id });
          if (question) {
            question.options = [
              { text: options.correct, isCorrect: true, explanation: `Corect: ${options.correct}` },
              { text: options.incorrect[0], isCorrect: false, explanation: `Greșit` },
              { text: options.incorrect[1], isCorrect: false, explanation: `Greșit` },
              { text: options.incorrect[2], isCorrect: false, explanation: `Greșit` }
            ];
            await question.save();
            matFixed++;
            console.log(`✅ Fixed Mat ${lessonNum}`);
          }
        }
      }
    }
    // Fix Limba Română questions
    for (const lesson of limbaLessons) {
      const match = lesson.title.match(/L(\d+)/);
      if (match) {
        const lessonNum = `L${match[1]}`;
        const options = LIMBA_OPTIONS[lessonNum];
        if (options) {
          const question = await LectieQuestion.findOne({ lectieId: lesson._id });
          if (question) {
            question.options = [
              { text: options.correct, isCorrect: true, explanation: `Corect: ${options.correct}` },
              { text: options.incorrect[0], isCorrect: false, explanation: `Greșit` },
              { text: options.incorrect[1], isCorrect: false, explanation: `Greșit` },
              { text: options.incorrect[2], isCorrect: false, explanation: `Greșit` }
            ];
            await question.save();
            limbaFixed++;
            console.log(`✅ Fixed Limba ${lessonNum}`);
          }
        }
      }
    }
    console.log(`\n✅ Fixed ${matFixed} Matematica question options`);
    console.log(`✅ Fixed ${limbaFixed} Limba Română question options`);
    console.log(`✅ Total fixed: ${matFixed + limbaFixed} questions`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
