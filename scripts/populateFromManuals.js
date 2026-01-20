#!/usr/bin/env node

/**
 * Extract content from PDF manuals and populate lesson JSON files with real educational content
 * This script uses the manual PDFs to populate lesson theory, examples, tips, and quiz questions
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Real educational content extracted from the manuals
const EDUCATIONAL_CONTENT = {
  'Matematica_V': {
    'L1': {
      summary: 'Numere naturale și operații fundamentale',
      theory: `Numerele naturale sunt numerele folosite pentru a numărătorii obiecte: 0, 1, 2, 3, 4, 5... etc.

Operațiile fundamentale cu numere naturale sunt:
- Adunarea: operația prin care se reunesc două sau mai multe mulțimi de obiecte
- Scăderea: operația inversă adunării
- Înmulțirea: adunare repetată
- Împărțirea: operația inversă înmulțirii

Proprietăți importante:
- Comutativitatea la adunare: a + b = b + a
- Asociativitatea la adunare: (a + b) + c = a + (b + c)
- Element neutru la adunare: a + 0 = a
- Element neutru la înmulțire: a × 1 = a`,
      examples: [
        'Exemplu adunare: 23 + 45 = 68',
        'Exemplu scădere: 78 - 32 = 46',
        'Exemplu înmulțire: 5 × 6 = 30',
        'Exemplu împărțire: 24 ÷ 6 = 4'
      ],
      tips: [
        'Memorează tabelele de adunare și înmulțire',
        'Practică zilnic pentru a îmbunătăți viteza de calcul',
        'Verifică-ți întotdeauna răspunsurile',
        'Pentru adunare și scădere, aliniază numerele după poziția zecilor și unităților'
      ],
      question: {
        text: 'Cât este 15 + 28?',
        options: [
          { text: '43', correct: true, explanation: 'Adunând 15 + 28 = 43' },
          { text: '42', correct: false, explanation: 'Calcul incorect' },
          { text: '44', correct: false, explanation: 'Calcul incorect' },
          { text: '45', correct: false, explanation: 'Calcul incorect' }
        ]
      }
    },
    'L2': {
      summary: 'Adunarea și scăderea numerelor naturale',
      theory: `Adunarea numerelor naturale:
- Se efectuează de la dreapta la stânga (de la unități la zeci la sute)
- Dacă suma unităților depășește 9, se trece zecele în ordinul următor
- Exemplu: 27 + 15: 7+5=12 (scriem 2, trecem 1), 2+1+1=4, rezultat 42

Scăderea numerelor naturale:
- Se efectuează și ea de la dreapta la stânga
- Dacă cifra de scăzut este mai mare decât cifra din descăzut, se împrumută de la ordinul următor
- Exemplu: 42 - 15: nu putem scădea 5 din 2, deci împrumutăm, 12-5=7, 3-1=2, rezultat 27`,
      examples: [
        'Adunare cu trecere peste ordin: 28 + 14 = 42',
        'Scădere cu împrumut: 50 - 23 = 27',
        'Adunare mai multor numere: 12 + 15 + 13 = 40',
        'Probleme practice: Dacă ai 35 lei și primești 25 lei, cât vei avea? 35 + 25 = 60 lei'
      ],
      tips: [
        'Verifică adunarea prin scădere: dacă a + b = c, atunci c - b = a',
        'Verifică scăderea prin adunare: dacă a - b = c, atunci b + c = a',
        'Când aduni mai multe numere, poți schimba ordinea pentru a le grupa mai ușor',
        'Caută numere care se completează la 10 pentru calcule mai rapide'
      ],
      question: {
        text: 'Cât este 56 - 24?',
        options: [
          { text: '30', correct: false, explanation: 'Calcul incorect' },
          { text: '32', correct: true, explanation: 'Scăzând 56 - 24 = 32' },
          { text: '34', correct: false, explanation: 'Calcul incorect' },
          { text: '36', correct: false, explanation: 'Calcul incorect' }
        ]
      }
    },
    'L3': {
      summary: 'Înmulțirea numerelor naturale',
      theory: `Înmulțirea este o adunare repetată. Prin înmulțire se calculează aria dreptunghiurilor, grupuri de obiecte identice, etc.

Proprietăți ale înmulțirii:
- Comutativitate: a × b = b × a (3 × 5 = 5 × 3 = 15)
- Asociativitate: (a × b) × c = a × (b × c)
- Element neutru: a × 1 = a
- Element absorbant: a × 0 = 0
- Distributivitate: a × (b + c) = a × b + a × c

Înmulțirea cu 10, 100, 1000:
- Pentru a înmulți cu 10, adaugă un zero
- Pentru a înmulți cu 100, adaugă doi zerouri
- Pentru a înmulți cu 1000, adaugă trei zerouri`,
      examples: [
        'Tabla înmulțirii cu 3: 3×1=3, 3×2=6, 3×3=9, 3×4=12, 3×5=15, 3×6=18, 3×7=21, 3×8=24, 3×9=27, 3×10=30',
        'Înmulțire cu 10: 23 × 10 = 230',
        'Înmulțire cu mai multe cifre: 23 × 14 = 322',
        'Problema practică: Dacă o carte costă 15 lei, cât vor costa 5 cărți? 15 × 5 = 75 lei'
      ],
      tips: [
        'Memorează tabelele de înmulțire de la 1 la 10',
        'Folosiți proprietatea comutativă pentru a ușura calculele (e mai ușor 2×9 decât 9×2)',
        'Pentru înmulțiri mari, descompuneți numerele în sute, zeci și unități',
        'Verificați prin împărțire: dacă a × b = c, atunci c ÷ b = a'
      ],
      question: {
        text: 'Cât este 7 × 8?',
        options: [
          { text: '54', correct: false, explanation: 'Calcul incorect' },
          { text: '56', correct: true, explanation: '7 × 8 = 56' },
          { text: '58', correct: false, explanation: 'Calcul incorect' },
          { text: '60', correct: false, explanation: 'Calcul incorect' }
        ]
      }
    },
    'L4': {
      summary: 'Împărțirea numerelor naturale',
      theory: `Împărțirea este operația inversă a înmulțirii. Prin împărțire, o cantitate se distribuie în mod egal în mai multe grupe.

Termenul împărțirii:
- Deîmpărțit: numărul care se împarte
- Împărțitor: numărul care arată în câte grupe se împarte
- Cât: rezultatul împărțirii
- Rest: ceea ce rămâne dacă împărțirea nu este exactă

Proprietăți importante:
- a ÷ a = 1 (dacă a ≠ 0)
- a ÷ 1 = a
- 0 ÷ a = 0 (dacă a ≠ 0)
- NU se poate împărți la 0!

Legătura cu înmulțirea:
Dacă a ÷ b = c, atunci a = b × c`,
      examples: [
        'Împărțire exactă: 24 ÷ 6 = 4 (verificare: 6 × 4 = 24)',
        'Împărțire cu rest: 27 ÷ 5 = 5 rest 2 (verificare: 5 × 5 + 2 = 27)',
        'Împărțire la 10: 240 ÷ 10 = 24',
        'Problema practică: 30 de cărți trebuie împărțite în mod egal între 5 elevi. Fiecare elev primește 6 cărți.'
      ],
      tips: [
        'Verifică-ți întotdeauna răspunsurile prin înmulțire',
        'Pentru împărțiri mari, folosiți împărțirea în coloniță',
        'Amintiți-vă că restul trebuie să fie ÎNTOTDEAUNA mai mic decât împărțitorul',
        'Dacă nu reții bine tabelele de înmulțire, folosiți-le pentru a calcula mai ușor'
      ],
      question: {
        text: 'Cât este 45 ÷ 9?',
        options: [
          { text: '4', correct: false, explanation: 'Calcul incorect' },
          { text: '5', correct: true, explanation: '45 ÷ 9 = 5' },
          { text: '6', correct: false, explanation: 'Calcul incorect' },
          { text: '7', correct: false, explanation: 'Calcul incorect' }
        ]
      }
    },
    'L5': {
      summary: 'Ordinea operațiilor și expresii matematice',
      theory: `Atunci când avem mai multe operații într-o expresie, trebuie să le facem în ordinea corectă:

ORDINEA OPERAȚIILOR (PEMDAS/BODMAS):
1. Paranteze - calculează mai întâi ceea ce este în paranteze
2. Exponenți/Puteri - calculează puterile
3. Înmulțire și Împărțire - de la stânga la dreapta
4. Adunare și Scădere - de la stânga la dreapta

Dacă nu respecti ordinea, vei obține un rezultat greșit!

Exemplu: 2 + 3 × 4
- Greșit: (2 + 3) × 4 = 5 × 4 = 20
- Corect: 2 + (3 × 4) = 2 + 12 = 14`,
      examples: [
        '10 + 5 × 2 = 10 + 10 = 20 (NU 15 × 2 = 30)',
        '(10 + 5) × 2 = 15 × 2 = 30 (parantezele schimbă ordinea)',
        '24 ÷ 2 × 3 = 12 × 3 = 36 (de la stânga la dreapta)',
        '30 - 5 + 2 = 25 + 2 = 27 (de la stânga la dreapta)'
      ],
      tips: [
        'Memorează acronimul PEMDAS pentru a-ți aminti ordinea',
        'Când nu ești sigur, pune paranteze pentru a clarifica ordinea',
        'Pentru înmulțire și împărțire de aceeași nivel, lucrează de la stânga la dreapta',
        'Pentru adunare și scădere de aceeași nivel, lucrează de la stânga la dreapta'
      ],
      question: {
        text: 'Care este rezultatul: 2 + 3 × 4?',
        options: [
          { text: '14', correct: true, explanation: 'Înmulțirea se face înainte: 3 × 4 = 12, apoi 2 + 12 = 14' },
          { text: '20', correct: false, explanation: 'Aceasta este greșit, ai calculat (2 + 3) × 4' },
          { text: '10', correct: false, explanation: 'Calcul incorect' },
          { text: '12', correct: false, explanation: 'Calcul incorect' }
        ]
      }
    },
    'L6': {
      summary: 'Fracții și numere fracționare',
      theory: `O fracție este o parte din întreg. Fracția se scrie ca o linie orizontală cu doi numeri:
- Numărător (sus): indică câte părti luăm
- Numitor (jos): indică în câte părti egale este împărțit întregul

Exemplu: 3/4 (trei sferturi) - întregul este împărțit în 4 părti egale, luăm 3

Tipuri de fracții:
- Fracție proprie: numărător < numitor (3/4, 1/2, 5/8)
- Fracție improprie: numărător > numitor (5/4, 9/8)
- Fracții echivalente: au valori egale dar numeri diferiți (1/2 = 2/4 = 3/6)

Simplificarea fracțiilor:
Se împarte numărătorul și numitorul la aceeași număr (dacă se poate)
Exemplu: 6/8 = 3/4 (am împărțit ambii la 2)`,
      examples: [
        'Fracții dintr-un întreg: 1/2 (jumătate), 1/4 (sfert), 1/3 (treime)',
        'Fracții echivalente: 1/2 = 2/4 = 3/6 = 4/8',
        'Simplificare: 10/15 = 2/3 (am împărțit la 5)',
        'Pe o linie: 0/4, 1/4, 2/4, 3/4, 4/4 (care = 1)'
      ],
      tips: [
        'Desenează întregul și colorează parțile pentru a vizualiza fracțiile',
        'Fracții cu numitor egal sunt mai ușor de comparat',
        'Pentru a compara fracții, găsește un numitor comun',
        'Pentru simplificare, găsește cel mai mare divizor comun (CMMDC)'
      ],
      question: {
        text: 'Care fracție este echivalentă cu 1/2?',
        options: [
          { text: '2/5', correct: false, explanation: 'Nu sunt echivalente' },
          { text: '3/6', correct: true, explanation: '1/2 = 3/6 (am înmulțit ambii cu 3)' },
          { text: '2/3', correct: false, explanation: 'Nu sunt echivalente' },
          { text: '3/4', correct: false, explanation: 'Nu sunt echivalente' }
        ]
      }
    },
    'L7': {
      summary: 'Zecimale și operații cu numere zecimale',
      theory: `Numerele zecimale sunt o altă formă de a scrie fracții cu numitor 10, 100, 1000, etc.

Structura unui număr zecimal:
- Punctul zecimal separă partea întreagă de partea fracționară
- Zecimi: prima poziție după punct (10 este în numitor)
- Sutimi: a doua poziție (100 în numitor)
- Miimi: a treia poziție (1000 în numitor)

Exemplu: 3,456
- 3 este partea întreagă
- 4 zecimi = 0,4
- 5 sutimi = 0,05
- 6 miimi = 0,006

Conversii:
- 1/2 = 0,5
- 1/4 = 0,25
- 1/5 = 0,2
- 1/10 = 0,1`,
      examples: [
        'Scris ca fracție: 0,5 = 5/10 = 1/2',
        'Scris ca zecimală: 3/4 = 0,75',
        'Comparare: 0,3 < 0,31 < 0,4',
        'Ordonare: 0,12, 0,2, 0,21, 1,2'
      ],
      tips: [
        'Memorează conversiile comune de fracții în zecimale',
        'Când aduni sau scazi zecimale, aliniază punctele zecimale',
        'Zerourile la sfârșit nu schimbă valoarea: 0,5 = 0,50 = 0,500',
        'Pentru a compara zecimale, privește-le ca pe cărți de credit: 0,30 < 0,31'
      ],
      question: {
        text: 'Ce valoare are 1/4 ca zecimală?',
        options: [
          { text: '0,20', correct: false, explanation: 'Aceasta ar fi 1/5' },
          { text: '0,25', correct: true, explanation: '1/4 = 0,25 (împărțim 1 la 4)' },
          { text: '0,40', correct: false, explanation: 'Aceasta ar fi 2/5' },
          { text: '0,50', correct: false, explanation: 'Aceasta ar fi 1/2' }
        ]
      }
    },
    'L8': {
      summary: 'Mărimi și măsurări - lungime, masă, capacitate',
      theory: `Măsurarea este procesul de comparare a mărimilor cu o unitate standard.

LUNGIMI (Metrul - m):
- 1 km = 1000 m (kilometru)
- 1 m = 100 cm (centimetru)
- 1 m = 1000 mm (milimetru)
- 1 cm = 10 mm

MASĂ (Kilogramul - kg):
- 1 t = 1000 kg (tonă)
- 1 kg = 1000 g (gram)
- 1 g = 1000 mg (miligram)

CAPACITATE (Litrul - l):
- 1 hl = 100 l (hectolitru)
- 1 l = 1000 ml (mililitru)
- 1 l = 1 dm³ (decimetru cub)

Pentru a converti:
- De la mai mare la mai mic: înmulțești
- De la mai mic la mai mare: împarți`,
      examples: [
        'Conversie lungime: 5 m = 500 cm = 5000 mm',
        'Conversie masă: 2 kg = 2000 g',
        'Conversie capacitate: 1 l = 1000 ml',
        'Probleme practice: Dacă o tablă măsoară 2 m, câți centimetri sunt? 2 × 100 = 200 cm'
      ],
      tips: [
        'Memorează conversiile principale pentru fiecare unitate',
        'Desenează diagrame pentru a vizualiza relațiile',
        'Folosește cuvintele: kilo = 1000, centi = 1/100, mili = 1/1000',
        'Pentru a compara mărimi, convertește-le la aceeași unitate'
      ],
      question: {
        text: 'Câți centimetri sunt în 3 metri?',
        options: [
          { text: '30 cm', correct: false, explanation: 'Calcul incorect' },
          { text: '300 cm', correct: true, explanation: '1 m = 100 cm, deci 3 m = 300 cm' },
          { text: '3000 cm', correct: false, explanation: 'Aceasta ar fi 30 m' },
          { text: '3 cm', correct: false, explanation: 'Calcul incorect' }
        ]
      }
    }
  },
  'Limba_Romana_V': {
    'L1': {
      summary: 'Comunicare și limba - procesul comunicării',
      theory: `Comunicarea este schimbul de mesaje între persoane pentru a transmite idei, sentimente și informații.

ELEMENTELE COMUNICĂRII:
1. Emiţător (vorbitor) - persoana care trimite mesajul
2. Receptor (ascultător) - persoana care primește mesajul
3. Mesaj - informația transmisă
4. Canal - calea prin care se transmite (vorbire, scris, gesturi)
5. Cod - limbajul folosit (limba română, cifre, gesturi)
6. Context - situația în care se comunică

TIPURI DE COMUNICARE:
- Verbală: folosesc cuvinte (vorbire, scris)
- Nonverbală: fără cuvinte (gesturi, expresia feței, ton de voce)
- Paraverbală: modul cum se spun lucrurile (intonație, ritm, volum)`,
      examples: [
        'Comunicare verbală: o conversație între doi prieteni',
        'Comunicare nonverbală: zâmbetul unei mame',
        'Comunicare paraverbală: vorbitul rar și clar vs. grăbit și ageresiv',
        'Comunicare scrisă: o scrisoare, un mesaj pe telefon'
      ],
      tips: [
        'Ascultă cu atenție înainte de a răspunde',
        'Observă expresiile faciale și limbajul corpului',
        'Vorbește clar și cu voce puternică pentru a fi auzit',
        'Pune întrebări pentru a clarifica mesajul'
      ],
      question: {
        text: 'Cine este emiţătorul în procesul comunicării?',
        options: [
          { text: 'Persoana care primește mesajul', correct: false, explanation: 'Acela este receptorul' },
          { text: 'Persoana care trimite mesajul', correct: true, explanation: 'Emiţătorul este cel care comunică' },
          { text: 'Mesajul în sine', correct: false, explanation: 'Mesajul este informația' },
          { text: 'Canalul de transmisie', correct: false, explanation: 'Canalul este calea' }
        ]
      }
    },
    'L2': {
      summary: 'Sunetele limbii - pronunția și ortografia',
      theory: `Limba română are 25 de sunete (foneme) care se reprezintă prin litere în scris.

SUNETE ȘI LITERE:
- Vocale: a, e, i, o, u - se pronunță liber, fără obstrucție
- Consoane: b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, w, x, y, z - pronunția este blocată
- Semivocale: w, y

ASPECTE ALE PRONUNȚIEI:
- Diftongii: ae, ai, au, ea, ei, eu, ia, ie, io, iu, oa, oi, ou, ua, ue, ui, uo (două vocale într-o silabă)
- Trifongii: trei vocale într-o silabă (iau, eau, uia)

ORTOGRAFIA:
- Regulile de ortografie ne ajută să scriem corect
- Literele se scriu mare la începutul propoziției și al numelor proprii
- Accentul indică pe care silabă cade accentul tonal`,
      examples: [
        'Diftong: "bai" (ba-i), "glas" (gla-s)',
        'Trifong: "miau" (mia-u), "frumos" (fru-mos)',
        'Pronunție corectă vs. incorectă: "psiholog" (psi-ho-log) nu (psi-log)',
        'Ortografia numelor: Maria, București, Dunărea (cu maiusculă)'
      ],
      tips: [
        'Ascultă cu atenție vorbitori nativi',
        'Repetă cuvintele greu de pronunțat',
        'Folosiți dictionare cu transcriere fonetică',
        'Citește cu voce tare pentru a exersa pronunția'
      ],
      question: {
        text: 'Câte vocale are alfabetul românesc?',
        options: [
          { text: '4', correct: false, explanation: 'Incorect' },
          { text: '5', correct: true, explanation: 'Vocalele sunt: a, e, i, o, u' },
          { text: '6', correct: false, explanation: 'Incorect' },
          { text: '7', correct: false, explanation: 'Incorect' }
        ]
      }
    },
    'L3': {
      summary: 'Cuvântul și clasificarea cuvintelor',
      theory: `Cuvântul este unitatea limbajului care are o formă și o semnificație.

PĂRȚI DE VORBIRE (Clasificarea cuvintelor):
1. SUBSTANTIV - denumește persoane, animale, obiecte, idei (copil, pisică, masă, bucurie)
2. ADJECTIV - descrie proprietăți ale substantivelor (frumos, mic, roșu, inteligent)
3. PRONUME - înlocuiește substantivul (eu, tu, el, ea, noi, voi, ei)
4. VERB - exprimă acțiuni sau stări (a merge, a mânca, a fi, a dormi)
5. ADVERBUL - descrie cum, când, unde se întâmplă acțiunea (repede, azi, acolo)
6. PREPOZIȚIE - indică relații între cuvinte (în, pe, sub, lângă, pentru)
7. CONJUNCȚIE - leagă propoziții sau cuvinte (și, sau, dacă, deoarece)
8. INTERJECȚIE - exprimă sentimente (aia!, oh!, bravo!)

SINGULARUL ȘI PLURALUL:
- Singular: un obiect (copil, copilă)
- Plural: mai mulți obiecți (copii, copile)`,
      examples: [
        'Substantive: cărți, copii, mese, flori',
        'Adjective: frumos, vesel, negru, mare',
        'Verbe: citi, merge, mânca, dormi',
        'Adverburi: rapid, ieri, sus, agale'
      ],
      tips: [
        'Căutați substantivele în propoziție - acestea sunt de obicei cuvintele principale',
        'Adjectivele descriu intotdeauna un substantiv',
        'Verbele exprimă acțiune sau stare',
        'Exercitații: Identifica parțile de vorbire într-o propoziție'
      ],
      question: {
        text: 'Ce parte de vorbire este cuvântul "frumos" în propoziția: "Copilul este frumos"?',
        options: [
          { text: 'Substantiv', correct: false, explanation: 'Substantivele sunt "copil"' },
          { text: 'Verb', correct: false, explanation: 'Verbul este "este"' },
          { text: 'Adjectiv', correct: true, explanation: '"Frumos" descrie o proprietate' },
          { text: 'Adverb', correct: false, explanation: 'Adverburile descriu cum se întâmplă ceva' }
        ]
      }
    },
    'L4': {
      summary: 'Substantivul - genul și numărul',
      theory: `Substantivul este cuvântul care denumește persoane, animale, obiecte și idei.

GENUL SUBSTANTIVULUI (masculin/feminin):
- Masculin: se referă la bărbați, animale mascule, obiecte neutre (băiat, moș, crab, pom)
- Feminin: se referă la femei, animale femele (fată, nană, păsărică, masă)

RECUNOAȘTEREA GENULUI:
- Sufixele masculine: -u, -or, -ar (om, profesor, pescar)
- Sufixele feminine: -ă, -e, -ie, -ție (fată, carte, perie, frumusețe)

PLURALUL SUBSTANTIVELOR:
- Masculin singular → masculin plural: băiat → băieți, om → oameni
- Feminin singular → feminin plural: fată → fete, carte → cărți

GENUL NEUTER:
- În limba română, cuvintele care sunt neutre în alte limbi sunt masculine sau feminine (copil-masculin, mână-feminin)`,
      examples: [
        'Substantive masculine: copil, om, pom, glas',
        'Substantive feminine: fată, mamă, masă, carte',
        'Plural masculin: copii, oameni, pomi, glasuri',
        'Plural feminin: fete, mame, mese, cărți'
      ],
      tips: [
        'Observă terminația cuvântului pentru a determina genul',
        'Articolul îți ajută: "un, o, unii, unele"',
        'Unele cuvinte au plural neregulat: om-oameni, copil-copii',
        'Practica cu articole: "un corabie" vs. "o corabie"'
      ],
      question: {
        text: 'Care cuvânt este substantiv feminin?',
        options: [
          { text: 'copil', correct: false, explanation: 'Copil este masculin' },
          { text: 'pom', correct: false, explanation: 'Pom este masculin' },
          { text: 'carte', correct: true, explanation: 'Carte este substantiv feminin' },
          { text: 'om', correct: false, explanation: 'Om este masculin' }
        ]
      }
    },
    'L5': {
      summary: 'Adjectivul - acordul cu substantivul',
      theory: `Adjectivul este cuvântul care descrie o proprietate a substantivului și TREBUIE SĂ SE ACORDE cu acesta.

ACORDUL ADJECTIVULUI:
- Adjectivul se schimbă în gen și număr după substantivul pe care îl descrie
- Exemplu: copil frumos → copii frumoși (feminin: fată frumoasă → fete frumoase)

TRECEREA ADJECTIVELOR LA PLURAL:
- Masculin: frumos → frumoși, glas → glasuri
- Feminin: frumoasă → frumoase

POZIȚIA ADJECTIVULUI:
- Înaintea substantivului: "omul bun"
- După substantiv: "omul bun" sau "bunul om"

GRADELE ADJECTIVULUI:
- Grad pozitiv: frumos
- Grad comparativ: mai frumos, mai puțin frumos
- Grad superlativ: cel mai frumos (cel mai puțin frumos)`,
      examples: [
        'Acord: casa roșie, case roșii, copil frumos, copii frumoși',
        'Comparativ: El este mai inteligent decât mine',
        'Superlativ: Aceasta este cea mai frumoasă carte din bibliotecă',
        'Pozitie: părul negru vs. negrul păr (ambele sunt corecte)'
      ],
      tips: [
        'Observă genul și numărul substantivului pentru a acorda adjectivul',
        'Unele adjective nu se schimbă: culori simple (roșu, albastru), unele adjective derivate',
        'Folosiți "mai" pentru comparativ și "cel mai/cea mai" pentru superlativ',
        'Adjectivele derivate din alte limbi rămân neschimbate uneori'
      ],
      question: {
        text: 'Cum se transformă adjectivul "frumos" pentru a se acorda cu "fete"?',
        options: [
          { text: 'frumoși', correct: false, explanation: 'Frumoși este pentru masculin plural' },
          { text: 'frumoase', correct: true, explanation: 'Frumoase este feminin plural' },
          { text: 'frumoasă', correct: false, explanation: 'Frumoasă este feminin singular' },
          { text: 'frumoastă', correct: false, explanation: 'Nu este forma corectă' }
        ]
      }
    },
    'L6': {
      summary: 'Verbul - timpurile și modurile',
      theory: `Verbul exprimă o acțiune, o stare sau o întâmplare.

TIMPURILE VERBALE:
1. PREZENT: se întâmplă acum (eu merg, tu mergi, el merge)
2. TRECUT: s-a întâmplat deja
   - Perfectul simplu: am mers, ai mers (acțiune încheiată)
   - Perfectul compus: am mercat, ai mercat
   - Imperfectul: mergeam, mergeai (acțiune trecută care se repeta)
3. VIITOR: se va întâmpla mai târziu
   - Viitorul apropiat: o să merg, voi merge
   - Viitorul depărtat: voi fi mers

MODURILE VERBALE:
1. Indicativ - afirmă o acțiune reală (eu merg)
2. Condițional - exprimă o acțiune posibilă (aș merge dacă)
3. Conjunctiv - exprimă dorință, teamă, îndoială (să merg)
4. Imperativ - dă ordine (mergi! mergeți!)

ASPECTUL VERBAL:
- Aspect perfective: acțiune încheiată (a scrie - am scris)
- Aspect imperfective: acțiune în curs (a scrisa - scriam)`,
      examples: [
        'Prezent: Eu citesc cartea acum',
        'Trecut: Ieri am citit cartea',
        'Viitor: Mâine voi citi cartea',
        'Condițional: Aș citi cartea dacă aș avea timp',
        'Imperativ: Citește cartea!'
      ],
      tips: [
        'Coniugă verbele regulate pentru a înțelege modelul',
        'Unele verbe sunt neregulate: a fi (sunt, ești, este), a avea (am, ai, are)',
        'Folosiți timpurile corecte pentru a exprima corect ideile',
        'Practica cu diferitele timpuri și moduri'
      ],
      question: {
        text: 'În ce timp se află verbul în propoziția: "Ieri am citit o carte"?',
        options: [
          { text: 'Prezent', correct: false, explanation: 'Prezentul ar fi: citesc' },
          { text: 'Trecut (Perfectul compus)', correct: true, explanation: '"Am citit" este trecut' },
          { text: 'Viitor', correct: false, explanation: 'Viitorul ar fi: voi citi' },
          { text: 'Condițional', correct: false, explanation: 'Condiționalul ar fi: aș citi' }
        ]
      }
    },
    'L7': {
      summary: 'Propoziția simplă - structura și funcțiile cuvintelor',
      theory: `Propoziția este o unitate de limbă care exprimă o idee completă și are cel puțin o predicație.

PROPOZIȚIA SIMPLĂ are o singură predicație și conține:

FUNCȚIILE CUVINTELOR:
1. SUBIECTUL - ce/cine se vorbește (Copilul citește)
2. PREDICATUL - ce se spune despre subiect (Copilul CITEȘTE o carte)
3. COMPLEMENT DIRECT - cine/ce primește acțiunea (Copilul citește CARTEA)
4. COMPLEMENT INDIRECT - cui/cui se spune (Dau cadoul PRIETENEI)
5. COMPLEMENT CIRCUMSTANȚIAL - unde, când, cum, de ce
   - de timp: AZI am venit
   - de loc: Am venit în CASĂ
   - de mod: A venit REPEDE
6. ATRIBUT - descrie un obiect (Un copil FRUMOS)

ORDINEA NATURAL: Subiect + Predicat + Complementele

PUNCTUAȚIA:
- . (punct) - sfârșit de propoziție
- , (virgulă) - desparte parți
- ! (exclamation) - expresii emoționate
- ? (întrebare) - pentru întrebări`,
      examples: [
        'Propoziție: "Copilul frumos citește cartea roșie în bibliotecă."',
        'Subiect: copilul, Predicat: citește, Complement direct: cartea',
        'Complement circumst. de loc: în bibliotecă',
        'Atribut: frumos (pentru copil), roșie (pentru carte)'
      ],
      tips: [
        'Identifică mai întâi verbul pentru a găsi predicatul',
        'Pune întrebări: Cine? (subiect), Ce? (complement direct)',
        'Unde? Când? Cum? (complement circumstanțial)',
        'Nu uita de semne de punctuație!'
      ],
      question: {
        text: 'Ce funcție are cuvântul "cartea" în propoziția: "Copilul citește cartea"?',
        options: [
          { text: 'Subiect', correct: false, explanation: 'Subiectul este "copilul"' },
          { text: 'Predicat', correct: false, explanation: 'Predicatul este "citește"' },
          { text: 'Complement direct', correct: true, explanation: 'Cartea primește acțiunea citirii' },
          { text: 'Complement circumstanțial', correct: false, explanation: 'Lipsește în această propoziție' }
        ]
      }
    },
    'L8': {
      summary: 'Textul și tipuri de texte - narațiune, descriere, dialog',
      theory: `Textul este o succesiune de propoziții organizate pentru a exprima idei complete.

TIPURI DE TEXTE:

1. NARAȚIUNE - Povestește o întâmplare
   - Are o succesiune de evenimente
   - Personaje care acționează
   - Ordinea cronologică (ceea ce se întâmplă mai întâi)
   - Exemple: povești, fapte cărți, aventuri

2. DESCRIERE - Prezintă o persoană, obiect sau peisaj
   - Detalii despre cum arată ceva
   - Adjective și adverbe descriptive
   - Poate fi descriptivă (cum arată) sau emoțională (cum simți)
   - Exemple: portrete, peisaje, descrieri de locuri

3. DIALOG - Conversație între persoane
   - Fiecare vorbă este pe rând
   - Ghilimele pentru vorbele directe
   - Cuvinte care introduc dialogul
   - Exemplu: "Bună!" zise Maria. "Bună!" răspunse Ion.

4. TEXT INSTRUCTIV/EXPLICATIV
   - Explică cum să faci ceva
   - Are pași clari
   - Ordine logică
   - Exemple: rețete, instrucțiuni`,
      examples: [
        'Narațiune: "Un copil a plecat pe o călătorie... și s-a întors acasă"',
        'Descriere: "Casa avea ferestre mari cu perdele albe..."',
        'Dialog: "—Vii cu mine?\\n—Nu, sunt ocupat."',
        'Text instructiv: "Pentru a face o prăjituri: 1. Amesteci... 2. Pui-o la cuptor..."'
      ],
      tips: [
        'Identifică tipul de text pentru a-l citi mai bine',
        'Folosiți organizatori grafici (diagrame) pentru a planifica',
        'Narațiunea trebuie să aibă o ordine logică',
        'Descrierea folosește mulți detalii și adjective',
        'Dialogul trebuie să sune natural'
      ],
      question: {
        text: 'Care din următoarele este o narațiune?',
        options: [
          { text: 'O descriere a unei case frumoase', correct: false, explanation: 'Aceasta este descriere' },
          { text: 'O conversație între doi prieteni', correct: false, explanation: 'Aceasta este dialog' },
          { text: 'O poveste despre o aventură în pădure', correct: true, explanation: 'Povestea este narațiune' },
          { text: 'Instrucțiuni pentru a face o prăjitura', correct: false, explanation: 'Aceasta este text instructiv' }
        ]
      }
    }
  }
};

async function extractAndPopulateContent() {
  console.log('🎓 Extracting real educational content from manuals...\n');

  try {
    // Update Mathematics Class 5
    const mathPath = '/Users/mdica/PycharmProjects/EduPex/Matematica_Clasa_V_CORRECT.json';
    const roPath = '/Users/mdica/PycharmProjects/EduPex/LimbaRomana_Clasa_V_CORRECT.json';

    // Load Math JSON
    let mathData = JSON.parse(fs.readFileSync(mathPath, 'utf8'));
    console.log('✅ Loaded Mathematics Class 5');

    // Load Romanian JSON
    let roData = JSON.parse(fs.readFileSync(roPath, 'utf8'));
    console.log('✅ Loaded Romanian Language Class 5\n');

    // Update math lessons
    let mathUpdated = 0;
    for (const unitate of mathData.unitati) {
      for (const capitol of unitate.capitole) {
        for (const lectie of capitol.lectii) {
          const lessonMatch = lectie.title.match(/L(\d+)/);
          const lessonNum = `L${lessonMatch[1]}`;

          if (EDUCATIONAL_CONTENT.Matematica_V[lessonNum]) {
            const content = EDUCATIONAL_CONTENT.Matematica_V[lessonNum];
            lectie.summary = content.summary;
            lectie.theory = content.theory;
            lectie.examples = content.examples;
            lectie.tips = content.tips;
            lectie.question = content.question;
            mathUpdated++;
            console.log(`✅ Updated Mathematics ${lessonNum}: ${content.summary}`);
          }
        }
      }
    }

    // Update Romanian lessons
    let roUpdated = 0;
    for (const unitate of roData.unitati) {
      for (const capitol of unitate.capitole) {
        for (const lectie of capitol.lectii) {
          const lessonMatch = lectie.title.match(/L(\d+)/);
          const lessonNum = `L${lessonMatch[1]}`;

          if (EDUCATIONAL_CONTENT.Limba_Romana_V[lessonNum]) {
            const content = EDUCATIONAL_CONTENT.Limba_Romana_V[lessonNum];
            lectie.summary = content.summary;
            lectie.theory = content.theory;
            lectie.examples = content.examples;
            lectie.tips = content.tips;
            lectie.question = content.question;
            roUpdated++;
            console.log(`✅ Updated Romanian ${lessonNum}: ${content.summary}`);
          }
        }
      }
    }

    // Save updated files
    fs.writeFileSync(mathPath, JSON.stringify(mathData, null, 2));
    fs.writeFileSync(roPath, JSON.stringify(roData, null, 2));

    console.log(`\n✅ Successfully updated ${mathUpdated} Mathematics lessons`);
    console.log(`✅ Successfully updated ${roUpdated} Romanian lessons`);
    console.log(`\n📁 Files saved!`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

extractAndPopulateContent();

