const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config();
const keywordManager = require('./keywordManager');

// Initialize keyword manager on startup
(async function() {
  try {
    await keywordManager.initialize();
    console.log('[DEBUG] Keyword manager initialized successfully');
  } catch (error) {
    console.error('[DEBUG] Error initializing keyword manager:', error);
  }
})();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define which embedding provider to use
const EMBEDDING_PROVIDER = process.env.EMBEDDING_PROVIDER || 'sentence-transformer'; // 'openai' or 'sentence-transformer'
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || '';

/**
 * Get content from the textbook_content table in Supabase
 * @param {number} limit - Maximum number of records to return
 * @param {number} page - Page number for pagination
 * @returns {Promise<Array>} - Array of content records
 */
async function getTextbookContent(limit = 10, page = 1) {
  // ...existing code...
}

/**
 * Search for textbook content based on a query
 * @param {string} query - The search query
 * @param {string} subject - Subject filter
 * @param {number} gradeLevel - Grade level filter
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} - Array of matching content records
 */
async function searchTextContent(query, subject, gradeLevel, limit = 3) {
  try {
    console.log(`[DEBUG] Searching for: "${query}" in subject: ${subject}, grade: ${gradeLevel}`);
    let data = [];
    let txtResults = [];
    let pdfResults = [];

    // Create a clean version of the query for search
    const cleanQuery = query.toLowerCase().trim().replace(/[^\w\s]/gi, '');

    // Handle special cases for common topics with expanded search terms
    const specialCases = [
      {
        keywords: ['pitagora', 'pythagor', 'teorema lui p'],
        searchTerms: ['teorema lui pitagora', 'pitagora', 'a^2 + b^2 = c^2', 'suma pătratelor catetelor', 'triunghiuri dreptunghice', 'ipotenuza']
      },
      {
        keywords: ['ecuatie', 'ecuații', 'ecuatii', 'de gradul'],
        searchTerms: ['ecuație', 'ecuații', 'rezolvarea ecuațiilor', 'ecuații de gradul', 'soluții ecuații']
      },
      {
        keywords: ['verb', 'verbe', 'conjugare', 'timpuri'],
        searchTerms: ['verb', 'conjugare', 'timpuri verbale', 'predicat', 'conjugarea verbelor']
      },
      {
        keywords: ['fracție', 'fractie', 'fracții', 'fractii', 'fractiilor'],
        searchTerms: ['fracție', 'fracții', 'operații cu fracții', 'numărător', 'numitor', 'fracții zecimale', 'fracții ordinare']
      },
      {
        keywords: ['limita', 'limită', 'limite', 'limitei'],
        searchTerms: ['limită', 'limite', 'calculul limitelor', 'lim', 'limita funcției']
      },
      {
        keywords: ['derivata', 'derivată', 'derivate', 'derivatei'],
        searchTerms: ['derivată', 'derivata funcției', 'reguli de derivare', 'calcul derivate']
      },
      {
        keywords: ['integrala', 'integrală', 'integrale', 'integralei'],
        searchTerms: ['integrală', 'primitive', 'integrare', 'calcul integrale']
      },
      {
        keywords: ['pronume', 'pronumele', 'pronumelor'],
        searchTerms: ['pronume', 'pronumele', 'tipuri de pronume', 'pronume personal']
      },
      {
        keywords: ['adjectiv', 'adjective', 'adjectivul', 'adjectivele'],
        searchTerms: ['adjectiv', 'adjective', 'gradele de comparație', 'acordul adjectivului']
      },
      {
        keywords: ['triunghi', 'triunghiul', 'triunghiuri', 'triunghiurilor'],
        searchTerms: ['triunghi', 'triunghiuri', 'clasificarea triunghiurilor', 'proprietăți triunghi']
      },
      {
        keywords: ['radical', 'radicali', 'radicalului', 'radicalilor'],
        searchTerms: ['radical', 'radicali', 'operații cu radicali', 'scoaterea factorilor de sub radical']
      },
      // Add special case for powers/exponents (puteri)
      {
        keywords: ['putere', 'puteri', 'puterea', 'puterile', 'exponent', 'exponenti', 'exponenți'],
        searchTerms: ['putere', 'puteri', 'reguli de calcul cu puteri', 'proprietăți ale puterilor', 'exponent', 'exponenți', 'ridicare la putere', 'calcul cu puteri', 'operații cu puteri', 'înmulțirea puterilor']
      },

      // === LIMBA ROMÂNĂ ===

      // Fonetică (Phonetics)
      {
        keywords: ['fonetică', 'fonetica', 'sunet', 'sunete', 'vocală', 'vocale', 'consoană', 'consoane', 'diftong', 'triftong', 'hiat'],
        searchTerms: ['fonetică', 'sunete', 'vocale', 'consoane', 'diftong', 'triftong', 'hiat', 'silabe', 'despărțirea în silabe', 'accent', 'intonație']
      },

      // Morfologie (Morphology)
      {
        keywords: ['morfologie', 'morfologia', 'parte de vorbire', 'părți de vorbire', 'părțile de vorbire'],
        searchTerms: ['morfologie', 'părți de vorbire', 'clasificarea părților de vorbire', 'părți de vorbire flexibile', 'părți de vorbire neflexibile']
      },

      // Substantiv (Noun)
      {
        keywords: ['substantiv', 'substantive', 'substantivul', 'substantivele', 'substantivelor'],
        searchTerms: ['substantiv', 'substantive', 'felul substantivelor', 'genul substantivelor', 'numărul substantivelor', 'cazurile substantivului', 'declinarea substantivelor', 'articolul substantival']
      },

      // Articol (Article)
      {
        keywords: ['articol', 'articole', 'articolul', 'articolele', 'hotărât', 'nehotărât', 'posesiv', 'demonstrativ'],
        searchTerms: ['articol', 'articol hotărât', 'articol nehotărât', 'articol posesiv', 'articol demonstrativ', 'folosirea articolului', 'articolul genitival']
      },

      // Prepoziție (Preposition)
      {
        keywords: ['prepoziție', 'prepozitie', 'prepoziții', 'prepozitii', 'prepozițiilor'],
        searchTerms: ['prepoziție', 'prepoziții', 'prepoziții simple', 'prepoziții compuse', 'locuțiuni prepoziționale', 'regimul prepozițiilor']
      },

      // Conjuncție (Conjunction)
      {
        keywords: ['conjuncție', 'conjunctie', 'conjuncții', 'conjunctii', 'conjuncțiilor'],
        searchTerms: ['conjuncție', 'conjuncții', 'conjuncții coordonatoare', 'conjuncții subordonatoare', 'locuțiuni conjuncționale']
      },

      // Interjecție (Interjection)
      {
        keywords: ['interjecție', 'interjectie', 'interjecții', 'interjectii', 'interjecțiilor'],
        searchTerms: ['interjecție', 'interjecții', 'tipuri de interjecții', 'interjecții onomatopeice', 'interjecții propriu-zise']
      },

      // Sintaxă (Syntax)
      {
        keywords: ['sintaxă', 'sintaxa', 'propoziție', 'propozitie', 'propoziții', 'propozitii', 'frază', 'fraza', 'fraze'],
        searchTerms: ['sintaxă', 'propoziție', 'frază', 'părțile propoziției', 'tipuri de propoziții', 'analiza sintactică', 'relații sintactice', 'coordonare', 'subordonare']
      },

      // Subiect (Subject)
      {
        keywords: ['subiect', 'subiecte', 'subiectul', 'subiectele', 'subiectiv'],
        searchTerms: ['subiect', 'subiectul gramatical', 'subiect exprimat', 'subiect neexprimat', 'subiect inclus', 'subiect subînțeles', 'subiect multiplu', 'acordul subiectului cu predicatul']
      },

      // Predicat (Predicate)
      {
        keywords: ['predicat', 'predicate', 'predicatul', 'predicatele', 'predicativ'],
        searchTerms: ['predicat', 'predicat verbal', 'predicat nominal', 'predicat verbal compus', 'predicat nominal compus', 'numele predicativ', 'exprimarea predicatului']
      },

      // Atribut (Attribute)
      {
        keywords: ['atribut', 'atribute', 'atributului', 'atributelor', 'atributiv'],
        searchTerms: ['atribut', 'atribut adjectival', 'atribut substantival', 'atribut pronominal', 'atribut verbal', 'atribut adverbial', 'atribut interjecțional', 'atribut prepoziționat']
      },

      // Complement (Object/Complement)
      {
        keywords: ['complement', 'complemente', 'complementul', 'complementele', 'complementar'],
        searchTerms: ['complement', 'complement direct', 'complement indirect', 'complement prepozițional', 'complement circumstanțial', 'complement circumstanțial de loc', 'complement circumstanțial de timp', 'complement circumstanțial de mod', 'complement circumstanțial de cauză']
      },

      // Literatura (Literature)
      {
        keywords: ['literatură', 'literatura', 'literar', 'literare', 'literari', 'literară'],
        searchTerms: ['literatură', 'genuri literare', 'specie literară', 'curente literare', 'figuri de stil', 'analiza textului literar', 'personaje literare', 'tema și motivul literar']
      },

      // Gen literar (Literary genre)
      {
        keywords: ['gen literar', 'genuri literare', 'epic', 'liric', 'dramatic'],
        searchTerms: ['gen literar', 'gen epic', 'gen liric', 'gen dramatic', 'trăsăturile genurilor literare', 'specii ale genului epic', 'specii ale genului liric', 'specii ale genului dramatic']
      },

      // Figuri de stil (Figures of speech)
      {
        keywords: ['figură de stil', 'figuri de stil', 'figura de stil', 'figurile de stil', 'stilistică'],
        searchTerms: ['figuri de stil', 'personificare', 'comparație', 'metaforă', 'epitet', 'hiperbolă', 'antiteză', 'repetiție', 'enumerație', 'alegorie', 'sinecdocă', 'metonimie', 'oximoron']
      },

      // === MATEMATICĂ ===

      // Operații aritmetice de bază (Basic arithmetic operations)
      {
        keywords: ['adunare', 'scădere', 'înmulțire', 'împărțire', 'operație', 'operații'],
        searchTerms: ['adunare', 'scădere', 'înmulțire', 'împărțire', 'ordinea operațiilor', 'proprietățile operațiilor', 'operații cu numere naturale', 'operații cu numere întregi', 'operații cu numere raționale', 'operații cu numere reale']
      },

      // Numere (Numbers)
      {
        keywords: ['număr', 'numere', 'numărului', 'numerelor', 'numerice'],
        searchTerms: ['număr', 'numere naturale', 'numere întregi', 'numere raționale', 'numere iraționale', 'numere reale', 'numere complexe', 'clasificarea numerelor', 'compararea numerelor', 'reprezentarea numerelor']
      },

      // Divizibilitate (Divisibility)
      {
        keywords: ['divizibilitate', 'divizor', 'divizori', 'multiplu', 'multiplii', 'cmmdc', 'cmmmc', 'prim'],
        searchTerms: ['divizibilitate', 'criteriu de divizibilitate', 'divizori', 'multipli', 'număr prim', 'numere prime', 'descompunere în factori primi', 'cel mai mare divizor comun', 'cel mai mic multiplu comun', 'algoritm euclidian']
      },

      // Geometrie (Geometry)
      {
        keywords: ['geometrie', 'geometria', 'geometric', 'geometrică', 'geometrici', 'geometrice'],
        searchTerms: ['geometrie', 'figuri geometrice', 'corpuri geometrice', 'proprietăți geometrice', 'construcții geometrice', 'geometrie plană', 'geometrie în spațiu', 'geometrie analitică']
      },

      // Patrulatere (Quadrilaterals)
      {
        keywords: ['patrulater', 'patrulatere', 'patrulaterului', 'patrulaterelor', 'paralelogram', 'romb', 'dreptunghi', 'pătrat', 'trapez'],
        searchTerms: ['patrulater', 'patrulatere', 'clasificarea patrulaterelor', 'paralelogram', 'proprietățile paralelogramului', 'romb', 'proprietățile rombului', 'dreptunghi', 'proprietățile dreptunghiului', 'pătrat', 'proprietățile pătratului', 'trapez', 'proprietățile trapezului']
      },

      // Cercul (Circle)
      {
        keywords: ['cerc', 'cercul', 'cercuri', 'cercurilor', 'circular', 'circulară'],
        searchTerms: ['cerc', 'elementele cercului', 'rază', 'diametru', 'coarde', 'arc de cerc', 'unghi la centru', 'unghi înscris', 'poziția relativă a unei drepte față de cerc', 'poziții relative a două cercuri', 'lungimea cercului', 'aria cercului', 'aria sectorului de cerc']
      },

      // Polinoame (Polynomials)
      {
        keywords: ['polinom', 'polinoame', 'polinomul', 'polinoamele', 'polinomială'],
        searchTerms: ['polinom', 'polinoame', 'grad polinom', 'operații cu polinoame', 'adunarea polinoamelor', 'scăderea polinoamelor', 'înmulțirea polinoamelor', 'împărțirea polinoamelor', 'valoarea unui polinom', 'factor comun', 'grupare de termeni', 'formule de calcul prescurtat']
      },

      // Funcții (Functions)
      {
        keywords: ['funcție', 'functie', 'funcții', 'functii', 'funcției', 'functiei', 'funcțiilor', 'functiilor'],
        searchTerms: ['funcție', 'funcții', 'graficul funcției', 'domeniu de definiție', 'codomeniu', 'imagine', 'proprietățile funcțiilor', 'funcție injectivă', 'funcție surjectivă', 'funcție bijectivă', 'funcție crescătoare', 'funcție descrescătoare', 'funcție monotonă', 'funcție pară', 'funcție impară', 'funcție compusă', 'funcție inversă']
      },

      // Funcții elementare (Elementary functions)
      {
        keywords: ['funcție de gradul', 'funcție afină', 'funcție liniară', 'funcție constantă', 'funcție radical', 'funcție exponențială', 'funcție logaritmică', 'funcție trigonometrică'],
        searchTerms: ['funcție de gradul întâi', 'funcție afină', 'funcție liniară', 'funcție constantă', 'funcție de gradul al doilea', 'funcție pătratică', 'funcție radical', 'funcție exponențială', 'funcție logaritmică', 'funcții trigonometrice', 'funcția sinus', 'funcția cosinus', 'funcția tangentă', 'funcția cotangentă']
      },

      // Trigonometrie (Trigonometry)
      {
        keywords: ['trigonometrie', 'trigonometria', 'trigonometric', 'trigonometrică', 'trigonometrici', 'trigonometrice', 'sinus', 'cosinus', 'tangentă', 'cotangentă'],
        searchTerms: ['trigonometrie', 'funcții trigonometrice', 'sinus', 'cosinus', 'tangentă', 'cotangentă', 'relații fundamentale în trigonometrie', 'formule trigonometrice', 'ecuații trigonometrice', 'inecuații trigonometrice', 'teorema sinusurilor', 'teorema cosinusurilor']
      },

      // Progresii (Progressions)
      {
        keywords: ['progresie', 'progresii', 'progresia', 'progresiilor', 'aritmetică', 'geometrică'],
        searchTerms: ['progresie', 'progresie aritmetică', 'proprietăți progresie aritmetică', 'termenul general al progresiei aritmetice', 'suma primilor n termeni ai progresiei aritmetice', 'progresie geometrică', 'proprietăți progresie geometrică', 'termenul general al progresiei geometrice', 'suma primilor n termeni ai progresiei geometrice']
      },

      // Probabilități și statistică (Probability and statistics)
      {
        keywords: ['probabilitate', 'probabilități', 'statistic', 'statistică', 'statistici'],
        searchTerms: ['probabilitate', 'probabilități', 'probabilitate clasică', 'evenimente', 'operații cu evenimente', 'variabilă aleatoare', 'medie', 'dispersie', 'abatere standard', 'statistică', 'serii statistice', 'indicatori statistici']
      },

      // === GRADE SPECIFIC MATHEMATICS ===

      // Grade 5 (Clasa a V-a)
      {
        keywords: ['clasa 5', 'clasa a cincea', 'clasa a V-a', 'clasa V', 'matematică clasa 5'],
        searchTerms: ['numere naturale', 'operații cu numere naturale', 'divizibilitate', 'mulțimi', 'operații cu mulțimi', 'unghiuri', 'triunghiuri', 'perimetru', 'arie', 'fracții ordinare', 'fracții zecimale']
      },

      // Grade 6 (Clasa a VI-a)
      {
        keywords: ['clasa 6', 'clasa a șasea', 'clasa a VI-a', 'clasa VI', 'matematică clasa 6'],
        searchTerms: ['numere întregi', 'operații cu numere întregi', 'rapoarte', 'proporții', 'procente', 'unități de măsură', 'mulțimi de numere', 'numere raționale', 'calcul algebric', 'ecuație de gradul întâi', 'patrulatere', 'cercul']
      },

      // Grade 7 (Clasa a VII-a)
      {
        keywords: ['clasa 7', 'clasa a șaptea', 'clasa a VII-a', 'clasa VII', 'matematică clasa 7'],
        searchTerms: ['numere reale', 'radical', 'rapoarte trigonometrice', 'patrate perfecte', 'ecuații', 'inecuații', 'sisteme de ecuații', 'paralelism', 'perpendicularitate', 'congruența triunghiurilor', 'asemănarea triunghiurilor', 'teorema lui Pitagora']
      },

      // Grade 8 (Clasa a VIII-a)
      {
        keywords: ['clasa 8', 'clasa a opta', 'clasa a VIII-a', 'clasa VIII', 'matematică clasa 8'],
        searchTerms: ['calcul numeric', 'calcul algebric', 'ecuații', 'funcții', 'grafice', 'patrulatere', 'asemănarea triunghiurilor', 'relații metrice', 'aria și perimetrul figurilor plane', 'corpuri geometrice', 'paralelipiped dreptunghic', 'cub', 'prisma dreaptă', 'piramida regulată', 'cilindru circular drept', 'con circular drept', 'sferă', 'probleme de geometrie în spațiu']
      },

      // Grade 9 (Clasa a IX-a)
      {
        keywords: ['clasa 9', 'clasa a noua', 'clasa a IX-a', 'clasa IX', 'matematică clasa 9'],
        searchTerms: ['mulțimi', 'numere reale', 'puteri', 'radicali', 'logaritmi', 'calcul algebric', 'ecuații', 'inecuații', 'sisteme de ecuații', 'funcția de gradul I', 'funcția de gradul II', 'vectori în plan', 'coliniaritate', 'vectori în coordonate', 'trigonometrie']
      },

      // Grade 10 (Clasa a X-a)
      {
        keywords: ['clasa 10', 'clasa a zecea', 'clasa a X-a', 'clasa X', 'matematică clasa 10'],
        searchTerms: ['mulțimi de numere', 'funcții și ecuații', 'șiruri', 'progresii', 'funcții continue', 'funcții derivabile', 'studiul funcțiilor cu ajutorul derivatelor', 'aplicații ale derivatelor', 'metode de numărare', 'matematici financiare', 'geometrie analitică']
      },

      // Grade 11 (Clasa a XI-a)
      {
        keywords: ['clasa 11', 'clasa a unsprezecea', 'clasa a XI-a', 'clasa XI', 'matematică clasa 11'],
        searchTerms: ['matrice', 'determinanți', 'sisteme de ecuații liniare', 'aplicații ale matricelor și determinanților', 'limite de funcții', 'continuitate', 'derivabilitate', 'reprezentarea grafică a funcțiilor', 'primitive', 'integrala definită', 'metode de calcul ale integralelor', 'aplicații ale integralei definite', 'ecuații diferențiale']
      },

      // Grade 12 (Clasa a XII-a)
      {
        keywords: ['clasa 12', 'clasa a douăsprezecea', 'clasa a XII-a', 'clasa XII', 'matematică clasa 12'],
        searchTerms: ['inducție matematică', 'formula lui Newton', 'polinoame', 'numere complexe', 'interpretare geometrică a numerelor complexe', 'legi de compoziție', 'grupuri', 'inele', 'corpuri', 'elemente de combinatorică', 'probabilități', 'statistică matematică', 'geometrie analitică în spațiu', 'recapitulare pentru bacalaureat']
      },

      // === GRADE SPECIFIC ROMANIAN LANGUAGE ===

      // Grade 5 (Clasa a V-a)
      {
        keywords: ['limba română clasa 5', 'română clasa 5', 'clasa a V-a română'],
        searchTerms: ['comunicare', 'text literar și nonliterar', 'substantivul', 'articolul', 'adjectivul', 'pronumele personal', 'pronumele reflexiv', 'verbul', 'moduri verbale', 'timpuri verbale', 'redactare', 'text narativ', 'text descriptiv', 'text dialogat']
      },

      // Grade 6 (Clasa a VI-a)
      {
        keywords: ['limba română clasa 6', 'română clasa 6', 'clasa a VI-a română'],
        searchTerms: ['propoziția', 'predicatul verbal', 'predicatul nominal', 'subiectul', 'atributul', 'complementul', 'textul epic', 'nuvela', 'povestirea', 'schița', 'textul liric', 'textul dramatic', 'personajul literar', 'pronume și adjective pronominale demonstrative', 'relative', 'interogative', 'negative', 'nehotărâte']
      },

      // Grade 7 (Clasa a VII-a)
      {
        keywords: ['limba română clasa 7', 'română clasa 7', 'clasa a VII-a română'],
        searchTerms: ['adverbul', 'prepoziția', 'conjuncția', 'interjecția', 'complementul direct', 'complementul indirect', 'complementele circumstanțiale', 'fraza', 'coordonarea', 'subordonarea', 'propoziții subordonate', 'figuri de stil', 'versificație', 'valori stilistice ale părților de vorbire']
      },

      // Grade 8 (Clasa a VIII-a)
      {
        keywords: ['limba română clasa 8', 'română clasa 8', 'clasa a VIII-a română'],
        searchTerms: ['propoziția subordonată subiectivă', 'propoziția subordonată predicativă', 'propoziția subordonată atributivă', 'propoziții subordonate circumstanțiale', 'literatura pașoptistă', 'romantismul', 'realismul', 'perioada marilor clasici', 'perioada interbelică', 'literatura postbelică', 'recapitulare pentru Evaluarea Națională']
      },

      // Grade 9 (Clasa a IX-a)
      {
        keywords: ['limba română clasa 9', 'română clasa 9', 'clasa a IX-a română'],
        searchTerms: ['limbă și comunicare', 'comunicarea', 'nivelurile limbii', 'lexicul', 'fonetică', 'vocabular', 'semantică', 'limba literară', 'normă și abatere', 'stilurile funcționale', 'textul', 'literatura și celelalte arte', 'structura textului narativ', 'personajul', 'autorul', 'naratorul', 'procedee narrative', 'genul epic']
      },

      // Grade 10 (Clasa a X-a)
      {
        keywords: ['limba română clasa 10', 'română clasa 10', 'clasa a X-a română'],
        searchTerms: ['morfosintaxa', 'clasele morfologice flexibile', 'clasele morfologice neflexibile', 'sintaxa propoziției', 'sintaxa frazei', 'textul poetic', 'figuri de stil', 'versificație', 'genul liric', 'textul dramatic', 'structură', 'conflict dramatic', 'tragicul și comicul', 'modalități de caracterizare a personajului dramatic']
      },

      // Grade 11 (Clasa a XI-a)
      {
        keywords: ['limba română clasa 11', 'română clasa 11', 'clasa a XI-a română'],
        searchTerms: ['curente literare', 'concepte operaționale', 'umanismul', 'iluminismul', 'romantismul', 'realismul', 'simbolismul', 'perioada marilor clasici', 'junimismul', 'modernismul', 'tradiționalismul', 'avangarda literară', 'poezia interbelică', 'proza interbelică', 'dramaturgia interbelică']
      },

      // Grade 12 (Clasa a XII-a)
      {
        keywords: ['limba română clasa 12', 'română clasa 12', 'clasa a XII-a română'],
        searchTerms: ['literatura postbelică', 'poezia românească din perioada postbelică', 'proza românească din perioada postbelică', 'dramaturgia românească din perioada postbelică', 'critica literară', 'analiza textului literar', 'eseul structurat și argumentativ', 'recapitulare pentru bacalaureat']
      }
    ];

    // Check if the query matches any special case
    const matchedCase = specialCases.find(specialCase =>
      specialCase.keywords.some(keyword => cleanQuery.includes(keyword))
    );

    if (matchedCase) {
      console.log(`[DEBUG] Detected special case query, using specialized search terms`);

      // Try each search term in the matched special case
      for (const term of matchedCase.searchTerms) {
        const { data: specialData, error: specialError } = await supabase
          .from('textbook_content')
          .select('*')
          .textSearch('content', term, {
            config: 'romanian',
            type: 'plain'
          })
          .eq(subject ? 'subject' : 'id', subject || '00000000-0000-0000-0000-000000000000')
          .eq(gradeLevel ? 'grade_level' : 'id', gradeLevel || '00000000-0000-0000-0000-000000000000')
          .order('page_number', { ascending: true }) // Order by page number for coherent results
          .limit(limit * 2); // Get more results than needed to filter

        if (!specialError && specialData && specialData.length > 0) {
          console.log(`[DEBUG] Found ${specialData.length} matches using special term: ${term}`);

          // Score and sort results by relevance
          const scoredResults = specialData.map(item => {
            // Calculate a relevance score based on:
            // 1. How often the term appears in the content
            const termCount = (item.content.toLowerCase().match(new RegExp(term.toLowerCase(), 'g')) || []).length;

            // 2. Whether the term appears in the first 100 characters (introduction is more important)
            const appearsInIntro = item.content.toLowerCase().substring(0, 100).includes(term.toLowerCase());

            // 3. Whether this is a direct chapter about the topic
            const isDirectChapter = item.chapter &&
                item.chapter.toLowerCase().includes(term.toLowerCase());

            // Calculate final score
            const score = termCount * 2 + (appearsInIntro ? 10 : 0) + (isDirectChapter ? 20 : 0);

            return { ...item, score };
          });

          // Sort by score (highest first)
          scoredResults.sort((a, b) => b.score - a.score);

          // Add to our results arrays
          const highQualityResults = scoredResults.filter(item => item.score > 5);
          if (highQualityResults.length > 0) {
            return highQualityResults.slice(0, limit);
          } else {
            return scoredResults.slice(0, limit);
          }
        }
      }
    }

    // If no special case matched or they yielded no results, proceed with regular search
    // Split query into keywords for more flexible matching
    const keywords = cleanQuery.split(/\s+/).filter(word => word.length > 3);

    // Try searching for each significant keyword
    if (keywords.length > 0) {
      for (const keyword of keywords) {
        if (keyword.length <= 3) continue; // Skip very short words

        console.log(`[DEBUG] Searching for keyword: "${keyword}"`);

        const { data: keywordData, error: keywordError } = await supabase
          .from('textbook_content')
          .select('*')
          .textSearch('content', keyword, {
            config: 'romanian',
            type: 'plain'
          })
          .eq(subject ? 'subject' : 'id', subject || '00000000-0000-0000-0000-000000000000')
          .eq(gradeLevel ? 'grade_level' : 'id', gradeLevel || '00000000-0000-0000-0000-000000000000')
          .limit(limit);

        if (!keywordError && keywordData && keywordData.length > 0) {
          console.log(`[DEBUG] Found ${keywordData.length} results for keyword: ${keyword}`);
          data = [...data, ...keywordData];

          // If we found enough results, break the loop
          if (data.length >= limit) {
            break;
          }
        }
      }
    }

    // If keywords search didn't yield enough results, try exact query
    if (data.length < limit) {
      console.log(`[DEBUG] Trying exact query search for: "${cleanQuery}"`);

      const { data: queryData, error: queryError } = await supabase
        .from('textbook_content')
        .select('*')
        .textSearch('content', cleanQuery, {
          config: 'romanian',
          type: 'plain'
        })
        .eq(subject ? 'subject' : 'id', subject || '00000000-0000-0000-0000-000000000000')
        .eq(gradeLevel ? 'grade_level' : 'id', gradeLevel || '00000000-0000-0000-0000-000000000000')
        .limit(limit);

      if (!queryError && queryData && queryData.length > 0) {
        console.log(`[DEBUG] Found ${queryData.length} results for exact query`);
        data = [...data, ...queryData];
      }
    }

    // Remove duplicates by ID
    const uniqueData = Array.from(new Set(data.map(item => item.id)))
      .map(id => data.find(item => item.id === id));

    console.log(`[DEBUG] Returning ${uniqueData.length} unique results`);

    // If results are limited or non-existent, log this for potential automatic keyword addition
    if (uniqueData.length < limit) {
      await keywordManager.analyzeMissingContext(query, subject, gradeLevel, uniqueData);
    }

    return uniqueData.slice(0, limit);

  } catch (error) {
    console.error('[DEBUG] Error in searchTextContent:', error.message);

    // Log failed searches to potentially improve keyword coverage
    try {
      await keywordManager.logMissingKeyword(query, subject, gradeLevel, 0);
    } catch (logError) {
      console.error('[DEBUG] Error logging missing keyword:', logError);
    }

    return [];
  }
}

/**
 * Get embeddings for a text using different providers
 * @param {string} text - The text to create embeddings for
 * @returns {Promise<Array>} - Vector embedding
 */
async function getEmbedding(text) {
  try {
    // Choose embedding provider based on configuration
    if (EMBEDDING_PROVIDER === 'openai' && process.env.OPENAI_API_KEY) {
      return await getOpenAIEmbedding(text);
    } else {
      return await getHuggingFaceEmbedding(text);
    }
  } catch (error) {
    console.error('Error generating embedding:', error);

    // If the primary embedding method fails, try the fallback method
    if (EMBEDDING_PROVIDER === 'openai') {
      console.log('Falling back to Hugging Face embeddings');
      try {
        return await getHuggingFaceEmbedding(text);
      } catch (fallbackError) {
        console.error('Fallback embedding also failed:', fallbackError);
        // Create a simple keyword-based pseudo-embedding as last resort
        return createKeywordPseudoEmbedding(text);
      }
    }

    return createKeywordPseudoEmbedding(text);
  }
}

/**
 * Get embeddings using OpenAI's API (paid)
 * @param {string} text - The text to embed
 * @returns {Promise<Array>} - Vector embedding
 */
async function getOpenAIEmbedding(text) {
  // Check if OpenAI is configured
  const OpenAI = require('openai');
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found. Cannot generate embeddings.');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text
  });

  return response.data[0].embedding;
}

/**
 * Get embeddings using Hugging Face's API (free)
 * @param {string} text - The text to embed
 * @returns {Promise<Array>} - Vector embedding
 */
async function getHuggingFaceEmbedding(text) {
  try {
    // Default to a good multilingual model
    const model = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2";

    // Check if we have a valid API key
    const hasValidApiKey = HUGGINGFACE_API_KEY &&
                          HUGGINGFACE_API_KEY.trim() !== '' &&
                          !HUGGINGFACE_API_KEY.includes('your_huggingface_api_key_here') &&
                          !HUGGINGFACE_API_KEY.includes('hf_example');

    if (!hasValidApiKey) {
      console.warn('[DEBUG] No valid Hugging Face API key found. Making unauthenticated request (which has strict rate limits).');
    } else {
      console.log('[DEBUG] Using authenticated Hugging Face API request with provided key.');
    }

    const headers = {
      'Content-Type': 'application/json'
    };

    // Only add Authorization header if we have a valid API key
    if (hasValidApiKey) {
      headers['Authorization'] = `Bearer ${HUGGINGFACE_API_KEY}`;
    }

    console.log(`[DEBUG] Requesting embedding from Hugging Face for text: "${text.substring(0, 30)}..."`);

    const response = await axios.post(
      `https://router.huggingface.co/pipeline/feature-extraction/${model}`,
      { inputs: text, options: { wait_for_model: true } },
      { headers }
    );

    if (response.data && Array.isArray(response.data)) {
      console.log('[DEBUG] Successfully received embedding from Hugging Face');
      return response.data;
    } else {
      console.error('[DEBUG] Unexpected response format from Hugging Face API:', response.data);
      throw new Error('Unexpected response format from Hugging Face API');
    }
  } catch (error) {
    console.error('[DEBUG] Error with Hugging Face embedding:', error.message);
    if (error.response && error.response.status === 401) {
      console.error('[DEBUG] Authentication error with Hugging Face API. Making unauthenticated request instead.');
      // Try again without authentication
      try {
        const response = await axios.post(
          `https://router.huggingface.co/pipeline/feature-extraction/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`,
          { inputs: text, options: { wait_for_model: true } },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data && Array.isArray(response.data)) {
          console.log('[DEBUG] Successfully received embedding from Hugging Face (unauthenticated)');
          return response.data;
        }
      } catch (retryError) {
        console.error('[DEBUG] Unauthenticated embedding request also failed:', retryError.message);
      }
    }
    throw error;
  }
}

/**
 * Create a simple pseudo-embedding based on keywords (fallback method)
 * @param {string} text - The text to create a pseudo-embedding for
 * @returns {Array} - A simple vector representation
 */
function createKeywordPseudoEmbedding(text) {
  // This is a very simplistic fallback that creates a pseudo-embedding
  // based on keyword presence. It's not as good as real embeddings but
  // better than nothing when all else fails.

  // A list of important keywords for educational content
  const keywords = [
    'definiție', 'teoremă', 'exemplu', 'problemă', 'exercițiu',
    'calcul', 'formulă', 'ecuație', 'triunghi', 'cerc', 'pitagora',
    'gramatică', 'verb', 'substantiv', 'propoziție', 'text',
    'algebra', 'geometrie', 'literatură', 'poezie', 'număr',
    'funcție', 'derivată', 'integrală', 'statistică',
    // Additional Pythagorean theorem specific keywords
    'teorema lui pitagora', 'catetă', 'ipotenuză', 'triunghi dreptunghic',
    'a²+b²=c²', 'suma pătratelor', 'pătrat', 'unghi drept'
  ];

  // Create a simple vector with 1 if keyword is present, 0 if not
  const textLower = text.toLowerCase();
  const embedding = keywords.map(keyword => textLower.includes(keyword.toLowerCase()) ? 1 : 0);

  // Give higher weight to specific topics if they are in the query
  if (textLower.includes('pitagora') || textLower.includes('pythagor')) {
    console.log('[DEBUG] Pythagorean theorem detected in query, optimizing pseudo-embedding');
    // Set higher values for math/geometry related dimensions
    const pythagoreanIndices = keywords.reduce((indices, keyword, index) => {
      if (['triunghi', 'pitagora', 'teoremă', 'geometrie', 'teorema lui pitagora',
           'catetă', 'ipotenuză', 'triunghi dreptunghic', 'a²+b²=c²'].includes(keyword)) {
        indices.push(index);
      }
      return indices;
    }, []);

    pythagoreanIndices.forEach(index => {
      embedding[index] = 2; // Give higher weight
    });
  }

  // Normalize the vector (important for cosine similarity)
  const sum = embedding.reduce((acc, val) => acc + val * val, 0);
  const magnitude = Math.sqrt(sum);

  // If all zeros, return a random embedding
  if (magnitude === 0) {
    return Array(embedding.length).fill(0).map(() => (Math.random() - 0.5) * 0.01);
  }

  return embedding.map(val => val / magnitude);
}

/**
 * Get contextual information for an AI question
 * @param {string} query - The question
 * @param {string} subject - Subject area
 * @param {number} gradeLevel - School grade level
 * @returns {Promise<Object>} - Object containing formatted context and references
 */
async function getAIContext(query, subject, gradeLevel) {
  // ...existing code...
}

module.exports = {
  getTextbookContent,
  searchTextContent,
  getEmbedding,
  getAIContext,
  supabase
};
