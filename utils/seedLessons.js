/**
 * Seed Script for Importing Lessons
 *
 * This script helps you import your lesson data into the database
 *
 * Usage:
 * 1. Prepare your data in JSON format (see examples below)
 * 2. Update the lessonData variable with your actual data
 * 3. Run: node backend/utils/seedLessons.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const {
  Materie,
  Clasa,
  UnitateDeInvatare,
  Capitol,
  Lectie,
  LectieQuestion
} = require('../models/Lesson');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// ==================== SAMPLE DATA STRUCTURE ====================
/**
 * You should provide data in this structure:
 *
 * {
 *   materie: "Matematica", // or "Limba Romana"
 *   clasa: "V", // V, VI, VII, VIII
 *   level: 5, // 5, 6, 7, 8
 *   unitati: [
 *     {
 *       name: "Numere și operații",
 *       description: "...",
 *       capitole: [
 *         {
 *           name: "Adunarea și scăderea",
 *           description: "...",
 *           lectii: [
 *             {
 *               title: "L1 - Adunarea numerelor naturale",
 *               summary: "Adunarea este operația prin care...",
 *               theory: "Explicație detaliată...",
 *               examples: ["2 + 3 = 5", "10 + 15 = 25"],
 *               tips: ["Ține minte...", "Poți folosi..."],
 *               estimatedTime: 15,
 *               questions: [
 *                 {
 *                   question: "Care este rezultatul: 5 + 3?",
 *                   options: [
 *                     { text: "8", correct: true, explanation: "Corect!" },
 *                     { text: "2", correct: false, explanation: "Greșit. 5 + 3 = 8" },
 *                     { text: "15", correct: false, explanation: "Greșit. 5 + 3 = 8" },
 *                     { text: "10", correct: false, explanation: "Greșit. 5 + 3 = 8" }
 *                   ],
 *                   difficulty: "easy"
 *                 },
 *                 ...more questions
 *               ]
 *             },
 *             ...more lessons
 *           ]
 *         },
 *         ...more chapters
 *       ]
 *     },
 *     ...more units
 *   ]
 * }
 */

// ==================== SEED FUNCTION ====================

async function seedLessons(lessonData) {
  try {
    // Clear existing data (optional - uncomment to clear)
    // await Materie.deleteMany({});
    // await Clasa.deleteMany({});
    // await UnitateDeInvatare.deleteMany({});
    // await Capitol.deleteMany({});
    // await Lectie.deleteMany({});
    // await LectieQuestion.deleteMany({});

    let materieOrder = 1;
    let clasaOrder = 1;
    let unitateOrder = 1;
    let capitolOrder = 1;
    let lectieOrder = 1;
    let questionOrder = 1;

    // Create or get Materie
    let materie = await Materie.findOne({ name: lessonData.materie });
    if (!materie) {
      materie = await Materie.create({
        name: lessonData.materie,
        order: materieOrder++
      });
      console.log(`✓ Created Materie: ${materie.name}`);
    } else {
      console.log(`✓ Using existing Materie: ${materie.name}`);
    }

    // Create or get Clasa
    let clasa = await Clasa.findOne({
      materieId: materie._id,
      name: lessonData.clasa
    });
    if (!clasa) {
      clasa = await Clasa.create({
        materieId: materie._id,
        name: lessonData.clasa,
        level: lessonData.level,
        order: clasaOrder++
      });
      console.log(`✓ Created Clasa: ${clasa.name}`);
    } else {
      console.log(`✓ Using existing Clasa: ${clasa.name}`);
    }

    // Process Unitati
    for (const unitatiData of lessonData.unitati) {
      let unitate = await UnitateDeInvatare.findOne({
        clasaId: clasa._id,
        name: unitatiData.name
      });

      if (!unitate) {
        unitate = await UnitateDeInvatare.create({
          clasaId: clasa._id,
          materieId: materie._id,
          name: unitatiData.name,
          description: unitatiData.description,
          order: unitateOrder++
        });
        console.log(`  ✓ Created Unitate: ${unitate.name}`);
      } else {
        console.log(`  ✓ Using existing Unitate: ${unitate.name}`);
      }

      // Process Capitole
      for (const capitolData of unitatiData.capitole) {
        let capitol = await Capitol.findOne({
          unitateId: unitate._id,
          name: capitolData.name
        });

        if (!capitol) {
          capitol = await Capitol.create({
            unitateId: unitate._id,
            clasaId: clasa._id,
            materieId: materie._id,
            name: capitolData.name,
            description: capitolData.description,
            order: capitolOrder++
          });
          console.log(`    ✓ Created Capitol: ${capitol.name}`);
        } else {
          console.log(`    ✓ Using existing Capitol: ${capitol.name}`);
        }

        // Process Lectii
        for (const lectieData of capitolData.lectii) {
          let lectie = await Lectie.findOne({
            capitolId: capitol._id,
            title: lectieData.title
          });

          if (!lectie) {
            lectie = await Lectie.create({
              capitolId: capitol._id,
              unitateId: unitate._id,
              clasaId: clasa._id,
              materieId: materie._id,
              title: lectieData.title,
              summary: lectieData.summary,
              content: {
                theory: lectieData.theory,
                examples: lectieData.examples,
                tips: lectieData.tips
              },
              estimatedTime: lectieData.estimatedTime,
              order: lectieOrder++
            });
            console.log(`      ✓ Created Lectie: ${lectie.title}`);
          } else {
            console.log(`      ✓ Using existing Lectie: ${lectie.title}`);
          }

          // Process Questions
          if (lectieData.questions && lectieData.questions.length > 0) {
            for (const questionData of lectieData.questions) {
              const questionExists = await LectieQuestion.findOne({
                lectieId: lectie._id,
                question: questionData.question
              });

              if (!questionExists) {
                const question = await LectieQuestion.create({
                  lectieId: lectie._id,
                  question: questionData.question,
                  options: questionData.options.map((opt, idx) => ({
                    text: opt.text,
                    isCorrect: opt.correct,
                    explanation: opt.explanation
                  })),
                  difficulty: questionData.difficulty || 'medium',
                  order: questionOrder++
                });
                console.log(`        ✓ Created Question: "${question.question.substring(0, 50)}..."`);
              } else {
                console.log(`        ✓ Using existing Question: "${questionData.question.substring(0, 50)}..."`);
              }
            }
          }
        }
      }
    }

    console.log('\n✅ Lesson data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding lessons:', error);
    process.exit(1);
  }
}

// ==================== EXAMPLE USAGE ====================

/**
 * Example data (uncomment and replace with your actual data):
 */

const exampleData = {
  materie: "Matematica",
  clasa: "V",
  level: 5,
  unitati: [
    {
      name: "Numere și operații",
      description: "Introducere în operații matematice de bază",
      capitole: [
        {
          name: "Adunarea și scăderea",
          description: "Înțelegerea operațiilor de adunare și scădere",
          lectii: [
            {
              title: "L1 - Adunarea numerelor naturale",
              summary: "Adunarea este operația prin care combinăm două sau mai multe numere pentru a obține un rezultat.",
              theory: "Adunarea poate fi reprezentată cu ajutorul unei axe numerice. De exemplu, pentru 2 + 3, pornim de la 2 și facem 3 pași spre dreapta, ajungând la 5.",
              examples: ["2 + 3 = 5", "10 + 15 = 25", "7 + 8 = 15"],
              tips: ["Ordinea numerelor nu contează la adunare: 2 + 3 = 3 + 2", "Poți folosi o axă numerică pentru a vizualiza adunarea"],
              estimatedTime: 15,
              questions: [
                {
                  question: "Care este rezultatul: 5 + 3?",
                  options: [
                    { text: "8", correct: true, explanation: "Corect! 5 + 3 = 8" },
                    { text: "2", correct: false, explanation: "Greșit. Încerci din nou?" },
                    { text: "15", correct: false, explanation: "Greșit. 5 + 3 = 8, nu 15" },
                    { text: "10", correct: false, explanation: "Greșit. 5 + 3 = 8" }
                  ],
                  difficulty: "easy"
                },
                {
                  question: "Dacă ai 7 mere și primești 6 mai multe, câte mere ai în total?",
                  options: [
                    { text: "13", correct: true, explanation: "Corect! 7 + 6 = 13" },
                    { text: "1", correct: false, explanation: "Greșit. Trebuie să aduni." },
                    { text: "42", correct: false, explanation: "Greșit. 7 + 6 = 13, nu 42" },
                    { text: "12", correct: false, explanation: "Aproape! Dar 7 + 6 = 13" }
                  ],
                  difficulty: "easy"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Uncomment to run with example data:
// seedLessons(exampleData);

// Export for use in other files
module.exports = { seedLessons };

