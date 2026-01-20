#!/usr/bin/env node

/**
 * Fill L9-L13 with complete educational content
 * Each lesson needs: theory, examples, tips, and quiz questions
 */

const fs = require('fs');

// Complete content for Math L9-L13
const MATH_CONTENT = {
  'L9': {
    summary: 'Puterea cu exponent natural a unui număr natural',
    theory: `Puterea unui număr este o operație matematică care înseamnă înmulțirea unui număr cu el însuși de mai multe ori.

    Notație: a^n, unde:
    - a se numește bază
    - n se numește exponent
    - a^n = a × a × a × ... × a (de n ori)

    Exemple: 2^3 = 2 × 2 × 2 = 8; 5^2 = 5 × 5 = 25

    Cazuri speciale:
    - Orice număr la puterea 1 este egal cu acel număr: a^1 = a
    - Orice număr la puterea 0 este egal cu 1: a^0 = 1 (pentru a ≠ 0)
    - 1 la orice putere este 1: 1^n = 1

    Operații cu puteri:
    - Înmulțire: a^m × a^n = a^(m+n)
    - Împărțire: a^m ÷ a^n = a^(m-n)
    - Putere de putere: (a^m)^n = a^(m×n)
    - Putere de produs: (a×b)^n = a^n × b^n`,
    examples: [
      'Calculează 3^4: 3^4 = 3 × 3 × 3 × 3 = 9 × 9 = 81',
      'Calculează 2^5: 2^5 = 2 × 2 × 2 × 2 × 2 = 32',
      'Calculează 10^3: 10^3 = 10 × 10 × 10 = 1000',
      'Calculează 7^2: 7^2 = 7 × 7 = 49'
    ],
    tips: [
      'Pentru a calcula o putere, înmulțește baza cu ea însăși de atâtea ori cât arată exponentul',
      'Puterile cu baza 10 sunt ușor de calculat: 10^n are 1 urmat de n zerouri',
      'Orice număr la puterea 0 este 1, iar orice număr la puterea 1 este el însuși',
      'Puterile cresc foarte rapid - de aceea se folosesc în științe pentru a exprima numere foarte mari'
    ],
    question: {
      text: 'Calculează 4^3:',
      options: [
        { text: '12', correct: false, explanation: '4^3 înseamnă 4 × 4 × 4, nu 4 × 3' },
        { text: '16', correct: false, explanation: '16 este 4^2, nu 4^3' },
        { text: '64', correct: true, explanation: '4^3 = 4 × 4 × 4 = 64 ✓' },
        { text: '81', correct: false, explanation: '81 este 3^4, nu 4^3' }
      ]
    }
  },
  'L10': {
    summary: 'Ordinea efectuării operațiilor',
    theory: `Ordinea efectuării operațiilor este un set de reguli care ne spun în ce ordine să facem calculele atunci când avem mai multe operații într-o expresie matematică.

    Ordinea corectă (PEMDAS/BODMAS):
    1. Paranteză - Calculele din paranteză se fac primele
    2. Exponenți - Puterile se calculează în urmă
    3. Înmulțire și Împărțire - Se fac de la stânga la dreapta, în ordinea apariției
    4. Adunare și Scădere - Se fac de la stânga la dreapta, în ordinea apariției

    Important: Înmulțirea și împărțirea au aceeași prioritate, la fel ca și adunarea și scăderea. Se calculează în ordinea în care apar, de la stânga la dreapta.

    Exemplu: 2 + 3 × 4 = 2 + 12 = 14 (nu 5 × 4 = 20)
    De ce? Pentru că înmulțirea se face înainte de adunare.`,
    examples: [
      'Calculează 10 + 5 × 2: Înmulțirea are prioritate: 5 × 2 = 10, apoi 10 + 10 = 20',
      'Calculează (10 + 5) × 2: Paranteza se face prima: (10 + 5) = 15, apoi 15 × 2 = 30',
      'Calculează 20 - 8 ÷ 2: Împărțirea se face prima: 8 ÷ 2 = 4, apoi 20 - 4 = 16',
      'Calculează 2 + 3 × 4 - 5: Înmulțire: 3 × 4 = 12, apoi 2 + 12 - 5 = 9'
    ],
    tips: [
      'Reține acronimul PEMDAS: Paranteză, Exponenți, Înmulțire, Împărțire, Adunare, Scădere',
      'Dacă ai îndoieli, folosește paranteze pentru a clarifica ordinea operațiilor',
      'Înmulțirea și împărțirea sunt echivalente - se fac de la stânga la dreapta',
      'Adunarea și scăderea sunt echivalente - se fac de la stânga la dreapta'
    ],
    question: {
      text: 'Calculează 12 + 3 × 2:',
      options: [
        { text: '30', correct: false, explanation: 'Aceasta ar fi dacă adunarea se face prima: (12+3)×2=30, dar înmulțirea are prioritate' },
        { text: '18', correct: true, explanation: 'Corect! 3 × 2 = 6, apoi 12 + 6 = 18 ✓' },
        { text: '24', correct: false, explanation: '24 nu este rezultatul acestei operații' },
        { text: '6', correct: false, explanation: '6 este doar rezultatul înmulțirii, nu și al întregii expresii' }
      ]
    }
  },
  'L11': {
    summary: 'Divizibilitate. Criterii de divizibilitate',
    theory: `Un număr a se divide la un număr b (notație: b | a) dacă există un număr natural c, astfel încât a = b × c.

    Criteriile de divizibilitate sunt reguli care ne ajută să determinăm dacă un număr este divizibil cu altul fără a face împărțirea.

    Criteriile principale:
    - Divizibilitate cu 2: Ultimul cifră este pară (0, 2, 4, 6, 8)
    - Divizibilitate cu 3: Suma cifrelor este divizibilă cu 3
    - Divizibilitate cu 5: Ultimul cifră este 0 sau 5
    - Divizibilitate cu 10: Ultimul cifră este 0
    - Divizibilitate cu 4: Ultimele două cifre formează un număr divizibil cu 4
    - Divizibilitate cu 9: Suma cifrelor este divizibilă cu 9

    Exemplu: 246 este divizibil cu 2 (ultima cifră este 6, care este pară)
    Exemplu: 315 este divizibil cu 3 (3+1+5=9, care este divizibil cu 3)`,
    examples: [
      'Este 234 divizibil cu 2? Da, pentru că ultima cifră (4) este pară',
      'Este 345 divizibil cu 3? Da, pentru că 3+4+5=12, iar 12 este divizibil cu 3',
      'Este 570 divizibil cu 5? Da, pentru că ultima cifră este 0',
      'Este 728 divizibil cu 4? Da, pentru că 28 (ultimele două cifre) sunt divizibile cu 4'
    ],
    tips: [
      'Memorează criteriile de divizibilitate - ele te vor ajuta să economisești timp',
      'Pentru a verifica divizibilitatea cu 2, privește doar ultima cifră',
      'Pentru a verifica divizibilitatea cu 3 sau 9, adună toate cifrele',
      'Orice număr care se termină în 0 este divizibil atât cu 2, 5, cât și cu 10'
    ],
    question: {
      text: 'Este 243 divizibil cu 3?',
      options: [
        { text: 'Nu, pentru că nu se termină în 0', correct: false, explanation: 'Aceasta ar fi regula pentru 10, nu pentru 3' },
        { text: 'Da, pentru că 2+4+3=9, care este divizibil cu 3', correct: true, explanation: 'Corect! Suma cifrelor este 9, care se divide cu 3 ✓' },
        { text: 'Nu, pentru că 243 nu se divide exact', correct: false, explanation: '243 ÷ 3 = 81, deci se divide exact' },
        { text: 'Da, pentru că are trei cifre', correct: false, explanation: 'Numărul de cifre nu determină divizibilitatea' }
      ]
    }
  },
  'L12': {
    summary: 'Numere prime și numere compuse',
    theory: `Un număr prim este un număr natural mai mare decât 1 care are exact doi divizori: 1 și el însuși.
    Un număr compus este un număr natural care are mai mult de doi divizori.

    Numerele prime până la 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29

    Proprietăți importante:
    - 1 nu este nici prim, nici compus
    - 2 este singurul număr prim par
    - Orice număr compus poate fi scris ca produs de numere prime (Teorema Fundamentală a Aritmeticii)
    - Există infinit de numere prime

    Pentru a determina dacă un număr n este prim:
    - Verifică dacă se divide la 2, 3, 5, 7, ..., până la √n
    - Dacă nu are niciun divizor în acest interval, este prim

    Exemplu: Pentru a verifica dacă 17 este prim, verifici doar 2 și 3 (pentru că √17 ≈ 4.1)`,
    examples: [
      '7 este prim: are doar divizori 1 și 7',
      '12 este compus: are divizori 1, 2, 3, 4, 6, 12',
      '13 este prim: are doar divizori 1 și 13',
      '20 este compus: are divizori 1, 2, 4, 5, 10, 20'
    ],
    tips: [
      'Memorează numerele prime de la 2 la 20: 2, 3, 5, 7, 11, 13, 17, 19',
      'Singurul număr prim par este 2 - toți ceilalți numere pare sunt compuși',
      'Pentru a verifica dacă un număr mare este prim, nu trebuie să testezi toti divizorii până la el',
      'Numerele prime sunt blocurile de construcție ale tuturor numerelor naturale'
    ],
    question: {
      text: 'Care dintre aceste numere este prim?',
      options: [
        { text: '15', correct: false, explanation: '15 = 3 × 5, deci este compus' },
        { text: '21', correct: false, explanation: '21 = 3 × 7, deci este compus' },
        { text: '23', correct: true, explanation: '23 nu se divide la 2, 3, 5, deci este prim ✓' },
        { text: '25', correct: false, explanation: '25 = 5 × 5, deci este compus' }
      ]
    }
  },
  'L13': {
    summary: 'Descompunerea în factori primi',
    theory: `Descompunerea în factori primi înseamnă a scrie un număr compus ca produs de numere prime.

    Metoda: Împarte numărul succesiv la numere prime (2, 3, 5, 7, ...) până obții 1.

    Pași:
    1. Începe cu cel mai mic număr prim (2)
    2. Dacă numărul se divide, scrie factorul și continuă cu câtul
    3. Dacă nu se divide, treci la următorul număr prim
    4. Repetă până când ajungi la 1

    Exemplu: 60 = 2 × 30 = 2 × 2 × 15 = 2 × 2 × 3 × 5

    Scriere standard: 60 = 2² × 3 × 5

    Utilități:
    - Găsirea celui mai mare divizor comun (CMMDC)
    - Găsirea celui mai mic multiplu comun (CMMMC)
    - Simplificarea fracțiilor
    - Determinarea proprietăților numărului`,
    examples: [
      'Descompune 12: 12 = 2 × 6 = 2 × 2 × 3 = 2² × 3',
      'Descompune 18: 18 = 2 × 9 = 2 × 3 × 3 = 2 × 3²',
      'Descompune 24: 24 = 2 × 12 = 2 × 2 × 6 = 2 × 2 × 2 × 3 = 2³ × 3',
      'Descompune 30: 30 = 2 × 15 = 2 × 3 × 5'
    ],
    tips: [
      'Poate ajuta să-ți faci o linie de împărțire și să notezi factorii pe dreapta',
      'Începe întotdeauna cu cel mai mic număr prim (2)',
      'Ordinea factorilor nu contează: 2 × 3 × 5 = 5 × 3 × 2',
      'Verifică-ți răspunsul prin înmulțirea factorilor: aceștia trebuie să dea numărul original'
    ],
    question: {
      text: 'Descompune 36 în factori primi:',
      options: [
        { text: '2 × 18', correct: false, explanation: 'Aceasta nu este descompunerea completă - 18 nu este prim' },
        { text: '2² × 3²', correct: true, explanation: '36 = 2 × 2 × 3 × 3 = 2² × 3² ✓' },
        { text: '2 × 3 × 6', correct: false, explanation: '6 nu este prim' },
        { text: '4 × 9', correct: false, explanation: '4 și 9 nu sunt numere prime' }
      ]
    }
  }
};

// Complete content for Romanian L9-L13
const ROMANIAN_CONTENT = {
  'L9': {
    summary: 'Redactarea unui text. Redactarea unui răspuns la o întrebare',
    theory: `Redactarea este procesul de a pune în cuvinte idei și gânduri într-o formă scrisă, structurată și coerentă.

    Redactarea unui text trebuie să respecte următoarele principii:
    1. Claritate: Ideile trebuie să fie clare și ușor de înțeles
    2. Coerență: Enunțurile trebuie să se conecteze logic
    3. Corectitudine: Respectarea regulilor de ortografie și punctuație
    4. Completitudine: Includerea tuturor informațiilor esențiale

    Când redactezi un răspuns la o întrebare:
    - Citeș cu atenție întrebarea
    - Identifică ce se cere exact
    - Structurează răspunsul logic
    - Folosește cuvinte potrivite și exprimări corecte
    - Revizuiește răspunsul înainte de a-l finaliza

    Exemplu de structură: Introducere → Dezvoltare → Concluzie`,
    examples: [
      'La întrebarea "Ce este comunicarea?" - răspunsul trebuie să definească conceptul și să dea exemple',
      'La o întrebare despre o poveste - trebuie să iei în considerare aspecte precum: personaje, acțiune, mesaj',
      'La o întrebare de analiză - trebuie să explici cumulative, nu doar să enumeri fapte',
      'La o întrebare de opinie - trebuie să-ți susții punctul de vedere cu argumente'
    ],
    tips: [
      'Planifică răspunsul înainte de a scrie: note rapide cu ideile principale',
      'Folosește propoziții complete și variază lungimea și structura lor',
      'Citește răspunsul din nou pentru a verifica dacă are sens și dacă e complet',
      'Nu ignora punctuația - virgulele și punctele sunt importante pentru claritate'
    ],
    question: {
      text: 'Ce este esențial în redactarea unui răspuns la o întrebare?',
      options: [
        { text: 'A scrie cât mai mult posibil', correct: false, explanation: 'Lungimea nu este criteriu - este importantă claritatea' },
        { text: 'A înțelege bine întrebarea și a raspunde la ceea ce se cere', correct: true, explanation: 'Corect! Trebuie să citești cu atenție și să răspunzi exact la ceea ce se întreabă ✓' },
        { text: 'A folosi cuvinte cât mai complicate', correct: false, explanation: 'Claritatea este mai importantă decât complexitatea cuvintelor' },
        { text: 'A copia din cărți fără a modifica nimic', correct: false, explanation: 'Trebuie să exprimi ideile cu cuvinte proprii' }
      ]
    }
  },
  'L10': {
    summary: 'Comunicare orală și redactare',
    theory: `Comunicarea orală este transmiterea mesajelor prin cuvânt vorbit, cu voce, intonație și gestivă.
    Redactarea (comunicarea scrisă) transmite mesaje prin text scris.

    Diferențe importante:
    - Comunicarea orală este spontană și directă; redactarea este mai planificată
    - Comunicarea orală poate folosi tone și expresii faciale; redactarea se bazează pe cuvinte și punctuație
    - Comunicarea orală permite reacții immediate; redactarea permite revizuire înainte de trimitere

    Elemente ale comunicării orale:
    - Tonul vocii (grav, ușor, strigat)
    - Ritmul și viteza vorbirii
    - Intonația și accentul
    - Gesturile și expresiile faciale
    - Contactul vizual

    Elemente ale redactării:
    - Alegerea cuvintelor potrivite
    - Structura enunțurilor
    - Punctuația
    - Organizarea textului în paragrafe
    - Ortografia corectă`,
    examples: [
      'Comunicare orală: Poți spune "Hei, vino repede!" cu urgență. Redactare: "Te rog să vii cât mai curând posibil."',
      'În oral poți folosi "hmm..." și pauze pentru gândire. În scris trebuie structurat clar',
      'Comunicarea orală beneficiază de tonul favorabil. Redactarea trebuie să fie foarte clară pentru a compensa lipsa tonului',
      'Poți corecta imediat în comunicarea orală. În redactare trebuie grijă mai mare la revizuire'
    ],
    tips: [
      'În comunicarea orală, vorbe cu încredere și articuleaza clar',
      'În redactare, citește textul din nou pentru a verifica coerenț și claritate',
      'Folosește punctuația pentru a marca pauze și intonații în texte scrise',
      'Ambele forme de comunicare sunt importante - antrenează-te la amândouă'
    ],
    question: {
      text: 'Care este o caracteristică a comunicării orale care lipsește în redactare?',
      options: [
        { text: 'Ortografia corectă', correct: false, explanation: 'Ortografia este importantă și în comunicarea scrisă' },
        { text: 'Tonul vocii și gesturile', correct: true, explanation: 'În comunicarea orală poți folosi ton și gesturi, în redactare nu ✓' },
        { text: 'Structura logică', correct: false, explanation: 'Structura logică este importantă în ambele forme' },
        { text: 'Utilizarea de cuvinte', correct: false, explanation: 'Cuvintele se folosesc în ambele forme de comunicare' }
      ]
    }
  },
  'L11': {
    summary: 'Textul narativ și descriptiv',
    theory: `Textul narativ (povestea) prezintă o succesiune de evenimente în timp, cu un început, o dezvoltare și un final.
    Textul descriptiv prezintă caracteristicile unui obiect, persoană, loc sau fenomen.

    Textul narativ conține:
    - Personaje (cine)
    - Acțiune (ce se întâmplă)
    - Timp (când se întâmplă)
    - Loc (unde se întâmplă)
    - Mesaj moral (ce înveți din poveste)

    Structura textului narativ:
    1. Expozitio: Prezentarea situației inițiale
    2. Nod (conflict): Complicația care apare
    3. Deznodământ: Rezolvarea conflictului
    4. Concluzie: Moralul sau lecția povestei

    Textul descriptiv conține:
    - Observații directe despre obiectul descris
    - Detalii senzoriale (cum arată, cum sună, cum miroase)
    - Adjectivele și adverbele care caracterizează
    - Comparații pentru claritate

    Diferența cheie: Naratiunea vorbește despre "ce se întâmplă", descrierea vorbește despre "cum arată"`,
    examples: [
      'Narație: "Ion și-a pierdut mingea în piscină. S-a gândit cum să o recupereze. A cerut ajutor bunicului. Împreună au găsit-o." - Aceasta spune o poveste',
      'Descriere: "Mingea era roșie, cu benzi albe și avea o textură puțin moale. Era albastră la interior și semigonflată." - Aceasta descrie caracteristicile mingei',
      'Narație: "Maria s-a întors acasă. Era întuneric. A auzit un zgomot ciudat. S-a speriat." - Progresiune de timp',
      'Descriere: "Casa era copacul frâu, cu frunze verzi și grosime. Interior era luminos și plin de cuvinte." - Caracterizare statică'
    ],
    tips: [
      'În naratiune, folosește cuvinte care marchează succesiunea: apoi, mai apoi, în sfârșit',
      'În descriere, folosește adjectivele și comparații pentru a picta o imagine clară',
      'Naratiunea poate conține descrieri, dar descrierea nu este neapărat o naratiune',
      'La citire, identifică dacă textul ți se pare mai mult dinamic (narație) sau static (descriere)'
    ],
    question: {
      text: 'Care este diferența principală între textul narativ și cel descriptiv?',
      options: [
        { text: 'Textul narativ este mai lung decât cel descriptiv', correct: false, explanation: 'Lungimea nu este diferența esențială' },
        { text: 'Textul narativ prezintă o succesiune de evenimente, iar cel descriptiv prezintă caracteristicile unui obiect', correct: true, explanation: 'Corect! Naratiunea spune ce se întâmplă, descrierea spune cum arată ✓' },
        { text: 'Textul descriptiv nu folosește adjectivele', correct: false, explanation: 'Descrierea folosește mulți adjectivi' },
        { text: 'Textul narativ nu are personaje', correct: false, explanation: 'Naratiunea are de obicei personaje' }
      ]
    }
  },
  'L12': {
    summary: 'Textul dialogat și alte forme de expresie',
    theory: `Textul dialogat (dialogul) este o conversație între două sau mai multe persoane, prezentă în povești, piese de teatru și scripturi.

    Caracteristicile dialogului:
    - Există mai mulți vorbitori
    - Fiecare replică (cuvântul spus) este pe o linie nouă
    - Se folosesc ghilimele (" ") pentru a marca replici directe
    - Diacriticele teatrale precizează cum se spune (bubuit, șoptit, etc.)

    Formatul corect al dialogului:
    "Salut!", spuse Ion.
    "Cum mai ești?", întrebă Maria.
    "Bine, mersi!", răspunse Ion.

    Alte forme de expresie:
    1. Monologul: Un singur personaj vorbind
    2. Descrierea: Prezentarea obiectelor și locurilor
    3. Naratiunea: Povestirea evenimentelor
    4. Reflecția: Gândurile și sentimentele personajelor
    5. Poezia: Expresie ritmată și sonora`,
    examples: [
      '"Unde mergi?", întrebă mama. "La prietenul meu", răspunse copilul.',
      'Monolog: "Azi e o zi frumoasă. Voi ieși la plimbare. Poate voi întâlni pe cineva prietenos."',
      'Dialog dintr-o piesă: PĂSTORUL: "Cine ești?" NECUNOSCUTUL: "Sunt un călător."',
      'Mișcare dramatică: "Deschide ușa repede!", strigă cu înfrigurare.'
    ],
    tips: [
      'Fiecare replică dintr-un dialog trebuie pe linie nouă, cu ghilimele',
      'După replica, pune virgulă, nu punct (dacă urmează verbe ca "spuse", "întreba")',
      'Dialogul trebuie să fie natural - așa vorbesc oamenii în realitate',
      'Variază verbele de rostire: spune, șoapte, strigă, mormăie, mârâie, etc.'
    ],
    question: {
      text: 'Care este regula corectă pentru scrierea dialogului?',
      options: [
        { text: 'Toate replicile pot fi pe aceeași linie', correct: false, explanation: 'Fiecare replică trebuie pe o linie nouă' },
        { text: 'Replicile se scriu cu ghilimele și fiecare pe o linie nouă', correct: true, explanation: 'Corect! Aceasta este formatul standard al dialogului ✓' },
        { text: 'Ghilimele nu sunt necesare dacă e clar cine vorbește', correct: false, explanation: 'Ghilimele sunt întotdeauna necesare pentru replici directe' },
        { text: 'Se pot combina mai mulți vorbitori pe aceeași linie', correct: false, explanation: 'Fiecare vorbitor are propria linie' }
      ]
    }
  },
  'L13': {
    summary: 'Evaluare și consolidare',
    theory: `Evaluarea și consolidarea sunt etape finale ale învățării care ajută la întărirea cunoștințelor și la identificarea lacunelor.

    Ce înseamnă evaluare?
    - Procesul de a măsura nivelul de înțelegere a unei teme
    - Ajută elevul să vadă ce a învățat bine și ce mai are nevoie să studieze
    - Poate fi auto-evaluare (tu te evaluezi) sau evaluare externă (profesor)

    Ce înseamnă consolidare?
    - Repetarea și aprofundarea cunoștințelor
    - Rezolvarea de exerciții suplimentare
    - Aplicarea cunoștințelor în contexte noi
    - Crearea de conexiuni între concepte

    Metode de evaluare:
    1. Teste și chestionare
    2. Proiecte și portofolii
    3. Observarea performanței
    4. Discuții și dezbateri
    5. Prezentări și expoziții

    Strategi de consolidare:
    - Revizuire regulată
    - Exerciții practice
    - Discuții cu alții
    - Aplicare în situații reale
    - Reflecție asupra propriei învățări`,
    examples: [
      'După o lecție despre text narativ, faci un test cu 5 întrebări - aceasta este evaluare',
      'După ce înțelegi dialogul, scrii propria ta conversație - aceasta este consolidare',
      'Te gândești la ce ai avut dificultă și studiezi din nou - auto-evaluare și consolidare',
      'Compari răspunsurile tale cu ale colegilor - reflecție și consolidare'
    ],
    tips: [
      'Nu te descuraja dacă nu reușești perfect la prima evaluare - este doar informație pentru îmbunătățire',
      'Consolidarea nu se termină după evaluare - continuă să repeți și să aprofundezi',
      'Fă-ți propriile teste și întrebări - acest lucru ajută foarte mult la consolidare',
      'Discută despre ceea ce ai învățat cu alții - aceasta ajută la aprofundare și consolidare'
    ],
    question: {
      text: 'Care este scopul principal al evaluării?',
      options: [
        { text: 'A da note și a stabili ranguri', correct: false, explanation: 'Evaluarea servește la mai mult decât doar notare' },
        { text: 'A penaliza elevii care nu cunosc răspunsurile', correct: false, explanation: 'Evaluarea nu este o pedeapsă' },
        { text: 'A măsura nivelul de înțelegere și a identifica ceea ce mai trebuie studiat', correct: true, explanation: 'Corect! Evaluarea ajută la progres prin oferirea feedback-ului ✓' },
        { text: 'A face ore mai dificile', correct: false, explanation: 'Evaluarea este instrument de ajutor, nu de dificultate' }
      ]
    }
  }
};

// Update JSON files
function updateJsonFiles() {
  const mathPath = '/Users/mdica/PycharmProjects/EduPex/Matematica_Clasa_V_CORRECT.json';
  const roPath = '/Users/mdica/PycharmProjects/EduPex/LimbaRomana_Clasa_V_CORRECT.json';

  // Update Math
  const mathData = JSON.parse(fs.readFileSync(mathPath, 'utf8'));
  let mathUpdated = 0;

  for (const unitate of mathData.unitati) {
    for (const capitol of unitate.capitole) {
      for (const lectie of capitol.lectii) {
        const match = lectie.title.match(/L(\d+)/);
        if (match) {
          const lessonKey = `L${match[1]}`;
          if (MATH_CONTENT[lessonKey]) {
            lectie.theory = MATH_CONTENT[lessonKey].theory;
            lectie.examples = MATH_CONTENT[lessonKey].examples;
            lectie.tips = MATH_CONTENT[lessonKey].tips;
            lectie.question = MATH_CONTENT[lessonKey].question;
            mathUpdated++;
          }
        }
      }
    }
  }

  fs.writeFileSync(mathPath, JSON.stringify(mathData, null, 2));
  console.log(`✅ Updated ${mathUpdated} Math lessons\n`);

  // Update Romanian
  const roData = JSON.parse(fs.readFileSync(roPath, 'utf8'));
  let roUpdated = 0;

  for (const unitate of roData.unitati) {
    for (const capitol of unitate.capitole) {
      for (const lectie of capitol.lectii) {
        const match = lectie.title.match(/L(\d+)/);
        if (match) {
          const lessonKey = `L${match[1]}`;
          if (ROMANIAN_CONTENT[lessonKey]) {
            lectie.theory = ROMANIAN_CONTENT[lessonKey].theory;
            lectie.examples = ROMANIAN_CONTENT[lessonKey].examples;
            lectie.tips = ROMANIAN_CONTENT[lessonKey].tips;
            lectie.question = ROMANIAN_CONTENT[lessonKey].question;
            roUpdated++;
          }
        }
      }
    }
  }

  fs.writeFileSync(roPath, JSON.stringify(roData, null, 2));
  console.log(`✅ Updated ${roUpdated} Romanian lessons\n`);

  return { mathUpdated, roUpdated };
}

console.log('╔══════════════════════════════════════════╗');
console.log('║  Fill L9-L13 with Complete Content      ║');
console.log('╚══════════════════════════════════════════╝\n');

const results = updateJsonFiles();
console.log(`📊 Total JSON lessons updated: ${results.mathUpdated + results.roUpdated}`);
console.log('\n✅ JSON files updated successfully!');
console.log('\nNext step: Run syncLessonsToDatabase.js to sync to MongoDB');

