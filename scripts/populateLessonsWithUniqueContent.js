#!/usr/bin/env node

/**
 * Generate unique lesson content and questions for all lessons
 * This creates meaningful summaries and unique questions for each lesson
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('../models/Lesson');

// Comprehensive lesson content library
const LESSON_CONTENT = {
  'Matematica': {
    'L1': {
      summary: 'Numere naturale și operații fundamentale',
      theory: 'Numerele naturale sunt numerele folosite pentru numărare: 0, 1, 2, 3... Acestea formează baza aritmeticii. Operațiile fundamentale sunt: adunarea, scăderea, înmulțirea și împărțirea.',
      examples: [
        'Exemplu 1: 2 + 3 = 5 (adunarea)',
        'Exemplu 2: 7 - 4 = 3 (scăderea)',
        'Exemplu 3: 3 × 4 = 12 (înmulțirea)'
      ],
      tips: [
        'Memorează tabelele de înmulțire până la 10',
        'Practică calcule zilnice pentru a îmbunătăți viteza'
      ],
      question: {
        text: 'Care este rezultatul: 8 + 5?',
        options: [
          { text: '12', correct: false },
          { text: '13', correct: true },
          { text: '14', correct: false },
          { text: '15', correct: false }
        ]
      }
    },
    'L2': {
      summary: 'Proprietățile adunării',
      theory: 'Adunarea are trei proprietăți importante: comutativă (a+b=b+a), asociativă ((a+b)+c=a+(b+c)) și element neutru (a+0=a). Zero este elementul neutru al adunării.',
      examples: [
        'Comutativă: 3 + 5 = 5 + 3 = 8',
        'Asociativă: (2 + 3) + 4 = 2 + (3 + 4) = 9',
        'Element neutru: 7 + 0 = 7'
      ],
      tips: [
        'Folosiți proprietatea comutativă pentru calcule mai ușoare',
        'Regrupați termenii pentru a simplifica calculul'
      ],
      question: {
        text: 'Dacă a + b = 15 și b = 6, cât este a?',
        options: [
          { text: '8', correct: false },
          { text: '9', correct: true },
          { text: '21', correct: false },
          { text: '10', correct: false }
        ]
      }
    },
    'L3': {
      summary: 'Scăderea și inversul adunării',
      theory: 'Scăderea este operația inversă a adunării. Dacă a - b = c, atunci a = b + c. Scăderea nu este comutativă și nu este asociativă. Pentru a scădea o sumă, scădem termenii pe rând.',
      examples: [
        'Exemplu: 12 - 5 = 7, verificare: 5 + 7 = 12',
        'Exemplu: 20 - (3 + 2) = 20 - 5 = 15',
        'Exemplu: 100 - 37 = 63'
      ],
      tips: [
        'Verifică întotdeauna scăderea cu adunarea',
        'Descompune scăderea pentru calcule mai ușoare'
      ],
      question: {
        text: 'Care este rezultatul: 25 - 8?',
        options: [
          { text: '16', correct: false },
          { text: '17', correct: true },
          { text: '18', correct: false },
          { text: '19', correct: false }
        ]
      }
    },
    'L4': {
      summary: 'Înmulțirea și tabla înmulțirii',
      theory: 'Înmulțirea este o adunare repetată. De exemplu, 4 × 3 = 3 + 3 + 3 + 3 = 12. Înmulțirea este comutativă (a×b=b×a), asociativă și distributivă. Elementul neutru al înmulțirii este 1.',
      examples: [
        'Exemplu: 5 × 3 = 3 + 3 + 3 + 3 + 3 = 15',
        'Exemplu: 6 × 4 = 4 × 6 = 24 (comutativă)',
        'Exemplu: 7 × 1 = 7 (element neutru)'
      ],
      tips: [
        'Memorează tabla înmulțirii pentru rezultate rapide',
        'Folosiți comutativitatea pentru calcule mai ușoare'
      ],
      question: {
        text: 'Care este rezultatul: 7 × 8?',
        options: [
          { text: '54', correct: false },
          { text: '55', correct: false },
          { text: '56', correct: true },
          { text: '57', correct: false }
        ]
      }
    },
    'L5': {
      summary: 'Împărțirea și relația cu înmulțirea',
      theory: 'Împărțirea este operația inversă a înmulțirii. Dacă a ÷ b = c, atunci a = b × c. Împărțirea nu este comutativă și nu este asociativă. Nu putem împărți niciodată la zero.',
      examples: [
        'Exemplu: 15 ÷ 3 = 5, verificare: 3 × 5 = 15',
        'Exemplu: 24 ÷ 6 = 4, verificare: 6 × 4 = 24',
        'Exemplu: 36 ÷ 4 = 9'
      ],
      tips: [
        'Verifică împărțirea cu înmulțirea',
        'Nu uita că nu putem împărți la zero'
      ],
      question: {
        text: 'Care este rezultatul: 48 ÷ 6?',
        options: [
          { text: '6', correct: false },
          { text: '7', correct: false },
          { text: '8', correct: true },
          { text: '9', correct: false }
        ]
      }
    },
    'L6': {
      summary: 'Ordinea operațiilor (PEMDAS/BODMAS)',
      theory: 'Când avem mai multe operații într-o expresie, trebuie să respectăm ordinea: 1) Parantezele, 2) Înmulțirea și împărțirea (de la stânga la dreapta), 3) Adunarea și scăderea (de la stânga la dreapta).',
      examples: [
        'Exemplu: 2 + 3 × 4 = 2 + 12 = 14 (nu 5 × 4)',
        'Exemplu: (2 + 3) × 4 = 5 × 4 = 20',
        'Exemplu: 24 ÷ 2 × 3 = 12 × 3 = 36'
      ],
      tips: [
        'Reamintire: Paranteze, Exponenți, Înmulțire/Împărțire, Adunare/Scădere',
        'Lucrează de la stânga la dreapta pentru operațiile de același nivel'
      ],
      question: {
        text: 'Care este rezultatul: 10 + 2 × 5?',
        options: [
          { text: '60', correct: false },
          { text: '12', correct: false },
          { text: '15', correct: false },
          { text: '20', correct: true }
        ]
      }
    },
    'L7': {
      summary: 'Fracții și operații cu fracții',
      theory: 'Fracțiile reprezintă părți dintr-un întreg. O fracție este compusă din numărător (sus) și numitor (jos). Numitorul indică în câte părți este împărțit întregul, iar numărătorul indică câte din acele părți luăm. Fracțiile echivalente sunt fracții care reprezintă aceeași valoare (de ex: 1/2 = 2/4).',
      examples: [
        'Exemplu: 1/2 înseamnă jumătate dintr-un întreg',
        'Exemplu: 3/4 înseamnă 3 din 4 părti egale',
        'Exemplu: 1/2 = 2/4 = 3/6 (fracții echivalente)'
      ],
      tips: [
        'Simplifică fracțiile prin împărțirea numărătorului și numitorului la aceiași număr',
        'Pentru a compara fracții, găsește un numitor comun'
      ],
      question: {
        text: 'Care fracție este echivalentă cu 1/2?',
        options: [
          { text: '2/3', correct: false },
          { text: '3/6', correct: true },
          { text: '2/5', correct: false },
          { text: '4/6', correct: false }
        ]
      }
    },
    'L8': {
      summary: 'Zecimale și conversia fracție-zecimală',
      theory: 'Numerele zecimale sunt o altă formă de a reprezenta fracții. Ele folosesc punctul zecimal pentru a separa întregii de părțile fracționare. Fiecare pozitie după punctul zecimal reprezintă putere de 10 (zecimi, sutimi, miimi). Pentru a converti o fracție în zecimală, împărțim numărătorul la numitor.',
      examples: [
        'Exemplu: 1/2 = 0,5 (jumătate)',
        'Exemplu: 3/4 = 0,75 (trei sferturi)',
        'Exemplu: 1/10 = 0,1 (unu pe zece)'
      ],
      tips: [
        'Memorează conversiile comune: 1/2=0,5; 1/4=0,25; 1/5=0,2; 1/10=0,1',
        'Practică împărțirea pentru a convertii fracții în zecimale'
      ],
      question: {
        text: 'Cât este 1/4 ca zecimală?',
        options: [
          { text: '0,2', correct: false },
          { text: '0,25', correct: true },
          { text: '0,4', correct: false },
          { text: '0,5', correct: false }
        ]
      }
    }
  },
  'Limba Romana': {
    'L1': {
      summary: 'Introducere în literatura română',
      theory: 'Literatura română are o bogată tradiție care se întinde pe mai multe secole. Principalele genuri literare sunt: proza (narări și romane), poezia (versuri cu ritm și rimă) și drama (piese teatrale). Fiecare gen are caracteristicile și convenții specifice care definesc forma și conținutul operei.',
      examples: [
        'Exemplu de proză: "Amintiri din copilărie" de Ion Creangă',
        'Exemplu de poezie: "Luceafărul" de Mihai Eminescu',
        'Exemplu de dramă: "O noapte furtunoasă" de I.L. Caragiale'
      ],
      tips: [
        'Citește atent texte din fiecare gen pentru a înțelege diferențele',
        'Observă structura și limbajul caracteristic fiecărui gen'
      ],
      question: {
        text: 'Care dintre următoarele este o operă de teatru?',
        options: [
          { text: '"Amintiri din copilărie"', correct: false },
          { text: '"Mizerabilii"', correct: false },
          { text: '"O noapte furtunoasă"', correct: true },
          { text: '"Don Quijote"', correct: false }
        ]
      }
    },
    'L2': {
      summary: 'Elementele prozei: personaje, intrigue și conflict',
      theory: 'Proza este forma literară cea mai întâlnită. Elementele principale ale unei povești sunt: personajele (cine), intriga (ce se întâmplă), setarea (unde și când), conflictul (problema care trebuie rezolvată) și rezoluția (cum se termină povestea).',
      examples: [
        'Personaj principal vs. secundar: Fănică vs. ceilalți din "Amintiri din copilărie"',
        'Conflict: luptele interne și externe ale personajelor',
        'Rezoluție: modul în care se rezolvă conflictul'
      ],
      tips: [
        'Identifică întotdeauna personajul principal și motivele sale',
        'Urmărește schimbarea personajelor pe parcursul poveștii'
      ],
      question: {
        text: 'Cine este personajul principal din "Amintiri din copilărie"?',
        options: [
          { text: 'Nae Cuznat', correct: false },
          { text: 'Ion Creangă (Fănică)', correct: true },
          { text: 'Grigore Creangă', correct: false },
          { text: 'Ioanid', correct: false }
        ]
      }
    },
    'L3': {
      summary: 'Elemente ale versificației: rimă, ritm și metru',
      theory: 'Poezia folosește ritm, rimă și imagini pentru a exprima emoții. Versurile sunt liniile individuale ale unei poerii, iar strofa este un grup de versuri. Rima se obține când versurile finale ale versurilor sună similar. Metrul este numărul de silabe dintr-un vers.',
      examples: [
        'Exemplu de rimă: maci/cărări (sunet similar la sfârșit)',
        'Exemplu de ritm: "Mi-e dor de veșnicele trepte" (8 silabe)',
        'Exemplu de anafora: "Vin vânturile, vin apele, vin cântecele"'
      ],
      tips: [
        'Citește poezia cu expresivitate pentru a simți ritmul',
        'Observă rima și asezarea versurilor pe pagină'
      ],
      question: {
        text: 'Ce este o rimă în poezie?',
        options: [
          { text: 'Repetarea unui sunet la începutul versurilor', correct: false },
          { text: 'Asemănarea sunetelor la sfârșitul versurilor', correct: true },
          { text: 'Numărul de silabe dintr-un vers', correct: false },
          { text: 'O figură de stil care compară două lucruri', correct: false }
        ]
      }
    },
    'L4': {
      summary: 'Figuri de stil: metaforă, comparație și personificare',
      theory: 'Figurile de stil sunt instrumente literare care fac textul mai expresiv și mai frumos. Metafora este o comparație fără "ca și" (de ex: "Inima ta e un vulcan"). Comparația folosește "ca și" (de ex: "Frumos ca o floare"). Personificarea dă calități umane lucrurilor neînsuflețite (de ex: "Vântul șoapte").',
      examples: [
        'Metaforă: "Ochii tăi sunt stele" (ochii nu sunt literal stele, dar sunt frumoși ca acestea)',
        'Comparație: "Curat ca zăpada" (comparație explicită)',
        'Personificare: "Pădurea șoapte misterios" (pădurea nu șoapte, dar textul o însuflețește)'
      ],
      tips: [
        'Identifică figurile de stil la lectura unui text',
        'Înțelege cum figurile de stil contribuie la sensul și frumusețea textului'
      ],
      question: {
        text: 'Care este o metaforă?',
        options: [
          { text: '"Curat ca apa"', correct: false },
          { text: '"Inima mea este o pasăre"', correct: true },
          { text: '"Pădurea cântă"', correct: false },
          { text: '"Frumos și plin de culoare"', correct: false }
        ]
      }
    },
    'L5': {
      summary: 'Analiza textelor: tema, mesaj și intenție autorului',
      theory: 'La lectura unui text, trebuie să identificăm tema (subiectul principal), mesajul (ce vrea să transmită autorul) și intenția (pentru ce a scris autorul aceasta - să informeze, să distreze, să emoționeze). Analiza aprofundată ne ajută să înțelegem mai bine opera.',
      examples: [
        'Temă: relația dintre oameni și natură',
        'Mesaj: importanța conservării mediului',
        'Intenție: să conștientizeze cititorul asupra problemelor de mediu'
      ],
      tips: [
        'Citește cu atenție și iau notițe privind ideile principale',
        'Gândește-te la contextul istoric în care a fost scrisă obra'
      ],
      question: {
        text: 'Care este diferența dintre temă și mesaj?',
        options: [
          { text: 'Sunt exact același lucru', correct: false },
          { text: 'Tema este subiectul, mesajul este ideea principală pe care vrea s-o transmită', correct: true },
          { text: 'Mesajul este subiectul, tema este ideea principală', correct: false },
          { text: 'Nu există o diferență între ele', correct: false }
        ]
      }
    },
    'L6': {
      summary: 'Scrierea creativă și tehnici de redactare',
      theory: 'Scrierea creativă ne permite să exprimăm idei și emoții în propriile cuvinte. Tehnicile importante includ: planificarea (ideație și organizare), redactarea (scrierea unei prime versiuni), revizuirea (corectarea și îmbunătățirea), și editarea (verificarea unei versiuni finale).',
      examples: [
        'Brainstorming: scriere liberă a ideilor fără autocenzură',
        'Crearea unui plan: organizarea ideilor înainte de redactare',
        'Revizuire: lectura și schimbarea textului pentru a fi mai clar'
      ],
      tips: [
        'Nu te gândi la perfecțiune în prima versiune - scrie liber!',
        'Cere feedback de la alții pentru a îmbunătăți textul tău'
      ],
      question: {
        text: 'Care este prima etapă a procesului de scriere creativă?',
        options: [
          { text: 'Editarea finală', correct: false },
          { text: 'Revizuirea', correct: false },
          { text: 'Planificarea și ideație', correct: true },
          { text: 'Publicarea textului', correct: false }
        ]
      }
    },
    'L7': {
      summary: 'Comunicarea și vorbirea în public',
      theory: 'Comunicarea eficace necesită claritate, organizare și abilitate de ascultare. Vorbirea în public poate fi intimidantă, dar cu practică și pregătire devine mai ușoară. Elementele cheie includ: cunoașterea subiectului, pregatire, contact vizual cu audiența, și intonație potrivită.',
      examples: [
        'Pregătire: exercitare textului înainte de prezentare',
        'Contact vizual: privire către diferitele persoane din audiență',
        'Intonație: variația volumului și vitezei vorbirii pentru a menține interes'
      ],
      tips: [
        'Practică în fața oglinzii sau cu prieteni înainte de prezentare',
        'Respira adânc și relaxează-te - emoțiile se observă în voce'
      ],
      question: {
        text: 'Care este un element important al vorbirii în public?',
        options: [
          { text: 'Să evuți contact vizual cu audiența', correct: false },
          { text: 'Să vorbești cât mai repede posibil', correct: false },
          { text: 'Contactul vizual și intonația potrivită', correct: true },
          { text: 'Să memorezi cuvânt cu cuvânt textul', correct: false }
        ]
      }
    },
    'L8': {
      summary: 'Literatura universală și opere clasice',
      theory: 'Literatura universală cuprinde opere clasice de la diferiți autori și perioade din întreaga lume. Aceste opere au influențat generații de cititori și continuă să fie relevante astazi. Exemple includ "Odiseea", "Don Quijote", "Orgoliul și prejudecata" și altele. Studierea acestor opere ne ajută să înțelegem culturile și valorile umane.',
      examples: [
        'Homer - "Odiseea" (epopeul grec ancient)',
        'Cervantes - "Don Quijote" (roman spaniol din sec. XVII)',
        'Austen - "Orgoliul și prejudecata" (roman britanic din sec. XIX)'
      ],
      tips: [
        'Citește versiuni adaptate pentru a face mai ușor accesul la opere clasice',
        'Compar diferitele culturi și perioade prin lucrări literare'
      ],
      question: {
        text: 'Cine este autorul "Odiseei"?',
        options: [
          { text: 'Cervantes', correct: false },
          { text: 'Homer', correct: true },
          { text: 'Jane Austen', correct: false },
          { text: 'Dante Alighieri', correct: false }
        ]
      }
    }
  }
};

async function updateLessons() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');

    console.log('🚀 Updating lessons with unique content...\n');
    await mongoose.connect(uri);

    const allLessons = await Lectie.find().sort({ materieId: 1, order: 1 });
    console.log(`Found ${allLessons.length} lessons to update\n`);

    let updated = 0;

    for (const lesson of allLessons) {
      try {
        // Determine subject from lesson
        let subject = 'Matematica';

        // Check lesson title to see if it's Math or Romanian
        if (lesson.title.includes('Substantiv') || lesson.title.includes('Adjective') ||
            lesson.title.includes('Verb') || lesson.title.includes('Literatura') ||
            lesson.title.includes('Pronume') || lesson.title.includes('Figuri')) {
          subject = 'Limba Romana';
        } else {
          // Check by material ID if available
          subject = lesson.materieId.toString().includes('696def98') ? 'Limba Romana' : 'Matematica';
        }

        // Extract lesson number (L1, L2, etc.)
        const lessonMatch = lesson.title.match(/L(\d+)/);
        const lessonNum = lessonMatch ? `L${lessonMatch[1]}` : null;

        // Get content for this lesson
        let content = LESSON_CONTENT[subject]?.[lessonNum];

        if (!content) {
          // Generate default content if not found
          const lessonOrder = lesson.order || 1;
          content = {
            summary: `${lesson.title} - Lecție importantă`,
            theory: `Aceasta este lecția ${lessonOrder} din curiculumul de ${subject}. Studiază atent materialul și completează exercițiile.`,
            examples: [
              `Exemplu 1 pentru ${lesson.title}`,
              `Exemplu 2 pentru ${lesson.title}`,
              `Exemplu 3 pentru ${lesson.title}`
            ],
            tips: [
              `Sfat 1: Concentrează-te pe conceptele principale`,
              `Sfat 2: Practică regulat pentru a înțelege mai bine`
            ],
            question: {
              text: `Ce ai învățat în ${lesson.title}?`,
              options: [
                { text: 'Răspuns A', correct: false },
                { text: 'Răspuns B', correct: true },
                { text: 'Răspuns C', correct: false },
                { text: 'Răspuns D', correct: false }
              ]
            }
          };
        }

        // Update lesson with correct nested structure
        await Lectie.findByIdAndUpdate(lesson._id, {
          summary: content.summary,
          content: {
            theory: content.theory,
            examples: content.examples,
            tips: content.tips
          }
        });

        // Update or create question
        let question = await LectieQuestion.findOne({ lectieId: lesson._id });

        if (!question) {
          question = new LectieQuestion({
            lectieId: lesson._id,
            question: content.question.text,
            options: content.question.options.map(opt => ({
              text: opt.text,
              isCorrect: opt.correct,
              explanation: ''
            })),
            order: 1
          });
          await question.save();
        } else {
          await LectieQuestion.findByIdAndUpdate(question._id, {
            question: content.question.text,
            options: content.question.options.map(opt => ({
              text: opt.text,
              isCorrect: opt.correct,
              explanation: ''
            }))
          });
        }

        updated++;
        if (updated % 20 === 0) {
          console.log(`✅ Updated ${updated}/${allLessons.length} lessons...`);
        }

      } catch (error) {
        console.error(`❌ Error updating lesson ${lesson.title}:`, error.message);
      }
    }

    console.log(`\n✅ COMPLETE! Updated ${updated} lessons with unique content!\n`);
    await mongoose.disconnect();

  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

updateLessons();

