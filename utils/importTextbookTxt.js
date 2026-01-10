const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Add debug statement for script start
console.log('Starting importTextbookTxt.js script...');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('ERROR: SUPABASE_URL and/or SUPABASE_SERVICE_KEY are missing from .env.');
  process.exit(1);
}

// Add debug statement for Supabase configuration
console.log(`Supabase URL: ${process.env.SUPABASE_URL ? 'Found' : 'Missing'}`);
console.log(`Supabase Key: ${process.env.SUPABASE_SERVICE_KEY ? 'Found' : 'Missing'}`);

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Cleans and formats text content to make it more readable
 * @param {string} content - The raw content from text files
 * @returns {string} - Cleaned and formatted content
 */
function cleanTextContent(content) {
  if (!content) return '';

  // Replace common OCR errors for Romanian characters
  let cleaned = content;
  cleaned = cleaned.replace(/\bn\b/g, 'în');
  cleaned = cleaned.replace(/\bsi\b/g, 'și');
  cleaned = cleaned.replace(/\bdreapt\\\s*([a-z])/gi, 'dreapta $1');
  cleaned = cleaned.replace(/distan\\ei/g, 'distanței');
  cleaned = cleaned.replace(/distan\\a/g, 'distanța');
  cleaned = cleaned.replace(/\\\s*([a-z])/g, 'ț$1');
  cleaned = cleaned.replace(/@n/g, 'în');
  cleaned = cleaned.replace(/@î/g, 'în');
  cleaned = cleaned.replace(/\[/g, 'ă');
  cleaned = cleaned.replace(/fi\\/g, 'și');
  cleaned = cleaned.replace(/calculat\[\s+/g, 'calculată ');
  cleaned = cleaned.replace(/Av`nd/g, 'Având');
  cleaned = cleaned.replace(/g[a\[]sim/g, 'găsim');
  cleaned = cleaned.replace(/ob\\inem/g, 'obținem');
  cleaned = cleaned.replace(/Calcula\\i/g, 'Calculați');

  // Fix mathematical symbols
  cleaned = cleaned.replace(/∢/g, 'unghiul');
  cleaned = cleaned.replace(/∆/g, 'triunghiul');
  cleaned = cleaned.replace(/≡/g, '≡');
  cleaned = cleaned.replace(/perpendicular[a]?\s*\./g, 'perpendiculara ');

  // Fix special notation for points, angles, triangles
  cleaned = cleaned.replace(/\b([A-Z])\s+([A-Z])\s+([A-Z])\b/g, '$1$2$3');
  cleaned = cleaned.replace(/\b([A-Z])\s+([A-Z])\b/g, '$1$2');
  cleaned = cleaned.replace(/\b([A-Z])\s*⊥\s*([A-Z])/g, '$1 perpendicular pe $2');
  cleaned = cleaned.replace(/\b∠\s*([A-Z])/g, 'unghiul $1');

  // Fix mathematical operations
  cleaned = cleaned.replace(/(\d+)\s*\^\s*(\d+)/g, '$1^$2');
  cleaned = cleaned.replace(/(\d+)\s*\*\s*(\d+)/g, '$1×$2');

  // Fix special paragraphs for problem solving
  cleaned = cleaned.replace(/Problem[a\[]?\s*rezolvat[a\[]?/g, 'Problemă rezolvată:');
  cleaned = cleaned.replace(/Solu\\ie/g, 'Soluție:');

  // Better handling of parentheses in mathematical expressions
  cleaned = cleaned.replace(/\(\s*([A-Za-z0-9]+)\s*,\s*([A-Za-z0-9]+)\s*\)/g, '($1,$2)');
  cleaned = cleaned.replace(/d\s*\(\s*([A-Za-z])\s*,\s*([A-Za-z0-9]+)\s*\)/g, 'd($1,$2)');

  // Fix distance notation
  cleaned = cleaned.replace(/d\s*\(\s*([A-Z])\s*,\s*([A-Z][A-Z])\s*\)/g, 'distanța de la $1 la dreapta $2');

  // Fix measurement units
  cleaned = cleaned.replace(/(\d+)\s*cm/g, '$1 cm');

  // Replace strange characters with their common equivalents
  cleaned = cleaned.replace(/…/g, '...');
  cleaned = cleaned.replace(/◗/g, '-');

  // Special case for "in triunghiul"
  cleaned = cleaned.replace(/@în triunghiul/g, 'În triunghiul');
  cleaned = cleaned.replace(/@n triunghiul/g, 'În triunghiul');

  // Special case for angle measurements
  cleaned = cleaned.replace(/([A-Z])\s*=\s*(\d+)/g, '$1 = $2°');

  return cleaned;
}

// Subject keywords to help identify the subject from content
const subjectKeywords = {
  // Main subjects
  'Mathematics': ['equation', 'algebra', 'geometry', 'mathematics', 'math', 'calculus', 'trigonometry', 'function', 'variable', 'formula', 'theorem', 'proof'],
  'Limba Romana': ['literatura', 'gramatica', 'poezie', 'roman', 'autor', 'personaj', 'sintaxa', 'morfologie', 'verbul', 'substantiv'],

  // Sub-topics for Mathematics
  'Algebra': ['equation', 'variable', 'polynomial', 'algebra', 'formula', 'expression', 'function', 'solve', 'solution', 'unknown', 'factor', 'coefficient'],
  'Geometry': ['geometry', 'triangle', 'circle', 'angle', 'polygon', 'square', 'rectangle', 'shape', 'area', 'volume', 'perimeter', 'theorem'],
  'Calculus': ['derivative', 'integral', 'limit', 'function', 'continuity', 'differentiation', 'integration', 'series', 'convergence', 'calculus'],
  'Trigonometry': ['sine', 'cosine', 'tangent', 'angle', 'triangle', 'trigonometric', 'radian', 'degree', 'periodic', 'trigonometry'],

  // Sub-topics for Limba Romana
  'Gramatica': ['sintaxa', 'morfologie', 'verbul', 'substantiv', 'adjectiv', 'pronume', 'adverb', 'propozitie', 'fraza', 'subiect', 'predicat'],
  'Literatura': ['poezie', 'roman', 'nuvela', 'personaj', 'autor', 'opera', 'tema', 'motiv', 'liric', 'epic', 'dramatic'],

  // Other subjects
  'Physics': ['physics', 'force', 'energy', 'motion', 'velocity', 'acceleration', 'mass', 'gravity', 'newton', 'electricity', 'magnetism', 'heat'],
  'Chemistry': ['chemistry', 'element', 'compound', 'molecule', 'reaction', 'acid', 'base', 'atom', 'periodic', 'solution', 'bond', 'organic'],
  'Biology': ['biology', 'cell', 'organism', 'evolution', 'genetics', 'dna', 'species', 'ecosystem', 'plant', 'animal', 'tissue', 'organ'],
  'History': ['history', 'century', 'war', 'civilization', 'empire', 'king', 'queen', 'president', 'nation', 'revolution', 'era', 'period'],
  'Geography': ['geography', 'map', 'continent', 'country', 'river', 'mountain', 'ocean', 'climate', 'population', 'region', 'city', 'terrain']
};

// Map of subjects to their possible sub-topics
const subjectToSubTopics = {
  'Mathematics': ['Algebra', 'Geometry', 'Calculus', 'Trigonometry'],
  'Limba Romana': ['Gramatica', 'Literatura']
};

/**
 * Try to determine the subject based on content analysis
 * @param {string} content - The textbook content
 * @returns {string} The detected subject or "General" if unclear
 */
function detectSubject(content) {
  if (!content) return "General";

  const contentLower = content.toLowerCase();
  let bestMatch = { subject: "General", score: 0 };

  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    let score = 0;
    keywords.forEach(keyword => {
      const regex = new RegExp('\\b' + keyword + '\\b', 'gi');
      const matches = contentLower.match(regex);
      if (matches) score += matches.length;
    });

    if (score > bestMatch.score) {
      bestMatch = { subject, score };
    }
  }

  // Return "General" if no strong matches
  return bestMatch.score >= 2 ? bestMatch.subject : "General";
}

/**
 * Try to determine the sub-topic within a main subject
 * @param {string} content - The textbook content
 * @param {string} mainSubject - The main subject (e.g., 'Mathematics')
 * @returns {string} The detected sub-topic or the main subject if unclear
 */
function detectSubTopic(content, mainSubject) {
  if (!content || !mainSubject || !subjectToSubTopics[mainSubject]) {
    return mainSubject;
  }

  const contentLower = content.toLowerCase();
  let bestMatch = { subTopic: mainSubject, score: 0 };

  // Check only sub-topics relevant to the main subject
  for (const subTopic of subjectToSubTopics[mainSubject]) {
    let score = 0;
    const keywords = subjectKeywords[subTopic] || [];

    keywords.forEach(keyword => {
      const regex = new RegExp('\\b' + keyword + '\\b', 'gi');
      const matches = contentLower.match(regex);
      if (matches) score += matches.length;
    });

    if (score > bestMatch.score) {
      bestMatch = { subTopic, score };
    }
  }

  // Return main subject if no strong matches
  return bestMatch.score >= 2 ? bestMatch.subTopic : mainSubject;
}

/**
 * Split text into pages by marker or by N lines (fallback)
 * @param {string} text - Full textbook text
 * @param {string} marker - Page marker (e.g., '=== PAGE ===')
 * @param {number} linesPerPage - Fallback: lines per page
 * @returns {Array} Array of {pageNum, text}
 */
function splitTextToPages(text, marker, linesPerPage = 40) {
  let pages = [];
  if (marker && text.includes(marker)) {
    const rawPages = text.split(marker);
    rawPages.forEach((p, i) => {
      pages.push({ pageNum: i + 1, text: p.trim() });
    });
  } else {
    // Fallback: split by lines
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i += linesPerPage) {
      const pageLines = lines.slice(i, i + linesPerPage);
      pages.push({ pageNum: Math.floor(i / linesPerPage) + 1, text: pageLines.join(' ').trim() });
    }
  }
  return pages;
}

async function importTxtTextbook(txtPath, subject, gradeLevel, chapter, options = {}) {
  const { marker = null, linesPerPage = 40, autoDetectSubject = false, detectTopic = false } = options;
  if (!fs.existsSync(txtPath)) {
    throw new Error(`TXT file not found: ${txtPath}`);
  }

  let rawText = fs.readFileSync(txtPath, 'utf8');

  // Clean the raw text content
  const cleanedText = cleanTextContent(rawText);

  // Auto-detect subject if requested
  const actualSubject = autoDetectSubject ? detectSubject(cleanedText) : subject;

  // Auto-detect topic within subject if requested
  let finalSubject = actualSubject;
  let topic = null;

  if (detectTopic && subjectToSubTopics[actualSubject]) {
    topic = detectSubTopic(cleanedText, actualSubject);
    // If we detected a sub-topic, use it as the chapter if no chapter was provided
    if (topic !== actualSubject && !chapter) {
      chapter = topic;
    }
  }

  const pages = splitTextToPages(cleanedText, marker, linesPerPage);
  const firebaseURL = `gs://edupex-514dc.firebasestorage.app/Manuale/Clasa ${gradeLevel}/${finalSubject}/${path.basename(txtPath)}`;

  if (topic && topic !== finalSubject) {
    console.log(`Importing ${path.basename(txtPath)} as ${finalSubject} (Sub-topic: ${topic}), Chapter: ${chapter || topic}`);
  } else {
    console.log(`Importing ${path.basename(txtPath)} as ${finalSubject}, Chapter: ${chapter || 'Unspecified'}`);
  }

  let successCount = 0, failCount = 0;
  for (const page of pages) {
    const insertData = {
      subject: finalSubject,
      grade_level: gradeLevel,
      chapter: chapter || topic || 'General',
      page_number: page.pageNum,
      content: page.text,
      pdf_url: firebaseURL,
      source_type: 'txt'
    };
    const { error } = await supabase.from('textbook_content').insert(insertData);
    if (error) {
      console.error(`Error inserting page ${page.pageNum}: ${error.message}`);
      failCount++;
    } else {
      successCount++;
    }
  }
  console.log(`Import completed for ${path.basename(txtPath)}: ${successCount} pages imported, ${failCount} failed.`);
  return { successCount, failCount, subject: finalSubject, topic };
}

async function importAllTxtFromFolder(folderPath, subject, gradeLevel, chapter, options = {}) {
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.txt'));
  if (files.length === 0) {
    console.log('No .txt files found in folder:', folderPath);
    return;
  }
  let totalSuccess = 0, totalFailed = 0;
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const inferredChapter = chapter || path.basename(file, '.txt');
    console.log(`Importing ${filePath} as chapter '${inferredChapter}'...`);
    const { successCount, failCount } = await importTxtTextbook(filePath, subject, gradeLevel, inferredChapter, options);
    totalSuccess += successCount;
    totalFailed += failCount;
  }
  console.log(`Total import completed: ${totalSuccess} pages imported, ${totalFailed} failed.`);
}

/**
 * Import all textbooks from a folder structure with multiple subjects and chapters
 * Format: rootFolder/[subject]/[chapter].txt
 */
async function importTextbooksWithStructure(rootFolder, gradeLevel, options = {}) {
  if (!fs.existsSync(rootFolder)) {
    throw new Error(`Root folder not found: ${rootFolder}`);
  }

  // Get all subject folders
  const subjects = fs.readdirSync(rootFolder, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (subjects.length === 0) {
    console.log('No subject folders found in:', rootFolder);
    return;
  }

  let totalImported = 0, totalFailed = 0;

  for (const subject of subjects) {
    const subjectPath = path.join(rootFolder, subject);
    console.log(`Processing subject: ${subject}`);

    // Get all text files in the subject folder
    const files = fs.readdirSync(subjectPath)
      .filter(file => file.endsWith('.txt'));

    if (files.length === 0) {
      console.log(`No .txt files found for subject ${subject}`);
      continue;
    }

    for (const file of files) {
      const filePath = path.join(subjectPath, file);
      const chapter = path.basename(file, '.txt');
      console.log(`Importing ${filePath} (Subject: ${subject}, Chapter: ${chapter})...`);
      const { successCount, failCount } = await importTxtTextbook(
        filePath,
        subject,
        gradeLevel,
        chapter,
        options
      );
      totalImported += successCount;
      totalFailed += failCount;
    }
  }

  console.log(`=== IMPORT SUMMARY ===`);
  console.log(`Total pages imported: ${totalImported}`);
  console.log(`Total pages failed: ${totalFailed}`);
}

/**
 * Import all textbooks from a flat folder structure
 * Will automatically detect subject based on content analysis
 */
async function importTextbooksAutoDetect(rootFolder, gradeLevel, options = {}) {
  if (!fs.existsSync(rootFolder)) {
    throw new Error(`Root folder not found: ${rootFolder}`);
  }

  const files = fs.readdirSync(rootFolder)
    .filter(file => file.toLowerCase().endsWith('.txt'));

  if (files.length === 0) {
    console.log('No .txt files found in folder:', rootFolder);
    return;
  }

  let totalImported = 0, totalFailed = 0;
  const subjectCounts = {};

  for (const file of files) {
    const filePath = path.join(rootFolder, file);
    const chapter = path.basename(file, '.txt');

    const { successCount, failCount, subject } = await importTxtTextbook(
      filePath,
      "Auto-detect", // This will be replaced by detected subject
      gradeLevel,
      chapter,
      { ...options, autoDetectSubject: true }
    );

    // Track how many files were assigned to each subject
    subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;

    totalImported += successCount;
    totalFailed += failCount;
  }

  console.log(`=== IMPORT SUMMARY ===`);
  console.log(`Total pages imported: ${totalImported}`);
  console.log(`Total pages failed: ${totalFailed}`);
  console.log(`Subject distribution:`);
  Object.entries(subjectCounts).forEach(([subject, count]) => {
    console.log(`  - ${subject}: ${count} file(s)`);
  });
}

/**
 * Import textbooks from a structure where main subjects are known but sub-topics need detection
 * Format: rootFolder/[known-subject]/[unknown-topic-files.txt]
 */
async function importTextbooksWithTopicDetection(rootFolder, gradeLevel, options = {}) {
  if (!fs.existsSync(rootFolder)) {
    throw new Error(`Root folder not found: ${rootFolder}`);
  }

  // Get all subject folders
  const subjects = fs.readdirSync(rootFolder, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (subjects.length === 0) {
    console.log('No subject folders found in:', rootFolder);
    return;
  }

  let totalImported = 0, totalFailed = 0;
  const topicDistribution = {};

  for (const subject of subjects) {
    const subjectPath = path.join(rootFolder, subject);
    console.log(`Processing subject folder: ${subject}`);

    // Get all text files in the subject folder
    const files = fs.readdirSync(subjectPath)
      .filter(file => file.toLowerCase().endsWith('.txt'));

    if (files.length === 0) {
      console.log(`No .txt files found for subject ${subject}`);
      continue;
    }

    topicDistribution[subject] = {};

    for (const file of files) {
      const filePath = path.join(subjectPath, file);
      const suggestedChapter = path.basename(file, '.txt');

      console.log(`Analyzing ${filePath} for topic detection...`);

      const { successCount, failCount, topic } = await importTxtTextbook(
        filePath,
        subject,
        gradeLevel,
        suggestedChapter,
        { ...options, detectTopic: true }
      );

      // Track topic distribution
      if (topic) {
        topicDistribution[subject][topic] = (topicDistribution[subject][topic] || 0) + 1;
      }

      totalImported += successCount;
      totalFailed += failCount;
    }
  }

  console.log(`=== IMPORT SUMMARY ===`);
  console.log(`Total pages imported: ${totalImported}`);
  console.log(`Total pages failed: ${totalFailed}`);
  console.log(`Topic distribution:`);

  Object.entries(topicDistribution).forEach(([subject, topics]) => {
    console.log(`  - ${subject}:`);
    Object.entries(topics).sort((a, b) => b[1] - a[1]).forEach(([topic, count]) => {
      console.log(`      ${topic}: ${count} file(s)`);
    });
  });
}

// CLI usage
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log(`
Usage:
  1. Import a single file:
     node importTextbookTxt.js --file <txtPath> --subject <subject> --grade <gradeLevel> --chapter <chapter> [--marker <marker>] [--lines <linesPerPage>]

  2. Import all files from a folder (same subject/chapter):
     node importTextbookTxt.js --folder <folderPath> --subject <subject> --grade <gradeLevel> --chapter <chapter> [--marker <marker>] [--lines <linesPerPage>]

  3. Import structured folder (organized by subjects and chapters):
     node importTextbookTxt.js --structure <rootFolder> --grade <gradeLevel> [--marker <marker>] [--lines <linesPerPage>]

     For structured import, files should be organized as:
     rootFolder/
       ├── subject1/
       │   ├── chapter1.txt
       │   └── chapter2.txt
       └── subject2/
           └── chapter1.txt

  4. Auto-detect subjects from content:
     node importTextbookTxt.js --auto <folderPath> --grade <gradeLevel> [--marker <marker>] [--lines <linesPerPage>]

     This will analyze each text file and automatically determine the most likely subject based on content.

  5. Detect topics within known subjects (NEW):
     node importTextbookTxt.js --topics <rootFolder> --grade <gradeLevel> [--marker <marker>] [--lines <linesPerPage>]

     For this mode, your files should be organized as:
     rootFolder/
       ├── Mathematics/               (known subject)
       │   ├── unknown-topic-1.txt    (script will detect if it's algebra, geometry, etc.)
       │   └── unknown-topic-2.txt
       └── Limba Romana/              (known subject)
           └── unknown-topic-3.txt    (script will detect if it's grammar, literature, etc.)
    `);
    process.exit(1);
  }

  let mode = null;
  let inputPath = null;
  let subject = null;
  let gradeLevel = null;
  let chapter = null;
  let marker = null;
  let linesPerPage = 40;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--file':
        mode = 'file';
        if (i + 1 < args.length) inputPath = args[++i];
        break;
      case '--folder':
        mode = 'folder';
        if (i + 1 < args.length) inputPath = args[++i];
        break;
      case '--structure':
        mode = 'structure';
        if (i + 1 < args.length) inputPath = args[++i];
        break;
      case '--auto':
        mode = 'auto';
        if (i + 1 < args.length) inputPath = args[++i];
        break;
      case '--topics':
        mode = 'topics';
        if (i + 1 < args.length) inputPath = args[++i];
        break;
      case '--subject':
        if (i + 1 < args.length) subject = args[++i];
        break;
      case '--grade':
        if (i + 1 < args.length) gradeLevel = parseInt(args[++i]);
        break;
      case '--chapter':
        if (i + 1 < args.length) chapter = args[++i];
        break;
      case '--marker':
        if (i + 1 < args.length) marker = args[++i];
        break;
      case '--lines':
        if (i + 1 < args.length) linesPerPage = parseInt(args[++i]);
        break;
    }
  }

  const options = { marker, linesPerPage };

  // Validate required parameters
  if (!inputPath || !gradeLevel) {
    console.error('ERROR: Missing required parameters');
    process.exit(1);
  }

  if ((mode === 'file' || mode === 'folder') && (!subject)) {
    console.error('ERROR: Subject is required for file/folder import mode');
    process.exit(1);
  }

  try {
    // Process based on mode
    switch (mode) {
      case 'file':
        if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isFile()) {
          throw new Error(`File does not exist: ${inputPath}`);
        }
        await importTxtTextbook(inputPath, subject, gradeLevel, chapter || path.basename(inputPath, '.txt'), options);
        break;

      case 'folder':
        if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isDirectory()) {
          throw new Error(`Folder does not exist: ${inputPath}`);
        }
        await importAllTxtFromFolder(inputPath, subject, gradeLevel, chapter, options);
        break;

      case 'structure':
        if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isDirectory()) {
          throw new Error(`Root folder does not exist: ${inputPath}`);
        }
        await importTextbooksWithStructure(inputPath, gradeLevel, options);
        break;

      case 'auto':
        if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isDirectory()) {
          throw new Error(`Folder does not exist: ${inputPath}`);
        }
        await importTextbooksAutoDetect(inputPath, gradeLevel, options);
        break;

      case 'topics':
        if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isDirectory()) {
          throw new Error(`Root folder does not exist: ${inputPath}`);
        }
        await importTextbooksWithTopicDetection(inputPath, gradeLevel, options);
        break;

      default:
        console.error('ERROR: Invalid mode. Use --file, --folder, --structure, --auto, or --topics');
        process.exit(1);
    }
  } catch (err) {
    console.error('Import failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Import failed:', err.message);
    process.exit(1);
  });
}

module.exports = {
  importTxtTextbook,
  importAllTxtFromFolder,
  importTextbooksWithStructure,
  importTextbooksAutoDetect,
  importTextbooksWithTopicDetection
};
