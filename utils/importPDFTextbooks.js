const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const OpenAI = require('openai');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://szbjppcmhshegyewsveu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// OpenAI configuration for embeddings
const openaiApiKey = process.env.OPENAI_API_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize OpenAI client if API key is available
let openai = null;
if (openaiApiKey) {
  openai = new OpenAI({ apiKey: openaiApiKey });
}

/**
 * Get embeddings for text using OpenAI's API
 * @param {string} text - The text to create embeddings for
 * @returns {Promise<Array>} - Vector embedding or null if not available
 */
async function getEmbedding(text) {
  if (!openai) {
    console.log(`${colors.yellow}Warning: OpenAI API key not set. Skipping embeddings generation.${colors.reset}`);
    return null;
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text.substring(0, 8000) // Limit to first 8000 chars (API limit)
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error(`${colors.red}Error generating embedding: ${error.message}${colors.reset}`);
    return null;
  }
}

/**
 * Extract text from a PDF file using pdf.js
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<Array>} - Array of objects with page number and text
 */
async function extractTextFromPDF(pdfPath) {
  try {
    // Import pdf.js correctly for the installed version
    const pdfjsLib = require('pdfjs-dist');

    // Set worker source - use absolute path to worker file
    const pdfjsWorkerPath = path.resolve(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.js');

    // Configure PDF.js with font settings and disable warnings
    console.log(`${colors.blue}Setting PDF.js worker path: ${pdfjsWorkerPath}${colors.reset}`);
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerPath;

    // Save original console.warn
    const originalWarn = console.warn;

    // Temporarily override console.warn to filter font-related warnings
    console.warn = function(msg) {
      if (msg && typeof msg === 'string' &&
         (msg.includes('fetchStandardFontData') ||
          msg.includes('TT: undefined function') ||
          msg.includes('TT: invalid function') ||
          msg.includes('glyf') ||  // Added to catch "glyf" table warnings
          msg.includes('font') ||
          (typeof msg === 'object' && msg.name === 'UnknownErrorException'))) {
        // Skip font-related warnings and TrueType font processor warnings
        return;
      }
      originalWarn.apply(console, arguments);
    };

    console.log(`${colors.blue}Reading PDF file: ${pdfPath}${colors.reset}`);
    const data = new Uint8Array(fs.readFileSync(pdfPath));

    console.log(`${colors.blue}Creating PDF document...${colors.reset}`);
    // Set advanced PDF.js options to better handle various PDF formats
    const loadingTask = pdfjsLib.getDocument({
      data,
      // Provide the standardFontDataUrl to prevent warnings about missing fonts
      // Add trailing slash to ensure proper path construction
      standardFontDataUrl: path.resolve(__dirname, '../node_modules/pdfjs-dist/standard_fonts/') + '/',
      // Disable font and image loading if not needed for text extraction
      disableFontFace: true,
      ignoreErrors: true,
      isEvalSupported: false,
      cMapUrl: path.resolve(__dirname, '../node_modules/pdfjs-dist/cmaps/'),
      cMapPacked: true
    });
    const pdf = await loadingTask.promise;

    console.log(`${colors.blue}PDF loaded successfully. Total pages: ${pdf.numPages}${colors.reset}`);

    const pages = [];

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Combine all text items on the page
        // Smarter join: avoid space if previous ends with a letter and current starts with a lowercase/diacritic
        let text = '';
        for (let j = 0; j < textContent.items.length; j++) {
          const curr = textContent.items[j].str;
          if (j === 0) {
            text += curr;
          } else {
            const prev = textContent.items[j - 1].str;
            // If prev ends with a letter and curr starts with a lowercase or diacritic, join without space
            if (/\p{L}$/u.test(prev) && /^[\p{Ll}\p{M}]/u.test(curr)) {
              text += curr;
            } else {
              text += ' ' + curr;
            }
          }
        }
        // Normalize to preserve Romanian characters
        text = text.normalize('NFC');

        pages.push({
          pageNum: i,
          text: text.trim()
        });

        if (i % 10 === 0 || i === pdf.numPages) {
          console.log(`${colors.green}Processed ${i}/${pdf.numPages} pages${colors.reset}`);
        }
      } catch (pageError) {
        console.error(`${colors.red}Error extracting text from page ${i}: ${pageError.message}${colors.reset}`);
        pages.push({
          pageNum: i,
          text: `[Error extracting text: ${pageError.message}]`
        });
      }
    }

    // Restore original console.warn
    console.warn = originalWarn;

    return pages;
  } catch (error) {
    console.error(`${colors.red}Error processing PDF: ${error.message}${colors.reset}`);
    throw error;
  }
}

/**
 * Determine grade level from folder name
 * @param {string} folderName - Folder name (e.g., "Clasa V", "Clasa VI", etc.)
 * @returns {number} - Grade level (5, 6, 7, or 8)
 */
function getGradeLevel(folderName) {
  const gradeMap = {
    'v': 5,
    'vi': 6,
    'vii': 7,
    'viii': 8,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8
  };

  // Extract the grade part (V, VI, VII, VIII, or number)
  const match = folderName.toLowerCase().match(/clasa\s+([vix0-9]+)/i) ||
                folderName.toLowerCase().match(/([vix0-9]+)/i);

  if (match && match[1]) {
    const grade = match[1].toLowerCase();
    return gradeMap[grade] || null;
  }

  return null;
}

/**
 * Determine subject from folder name
 * @param {string} folderName - Folder name (e.g., "Matematica", "Limba Romana", etc.)
 * @returns {string} - "mathematics" or "romanian"
 */
function getSubject(folderName) {
  const folder = folderName.toLowerCase();

  if (folder.includes('mate') || folder.includes('math')) {
    return 'mathematics';
  } else if (folder.includes('roman') || folder.includes('limba')) {
    return 'romanian';
  }

  return null;
}

/**
 * Get the list of columns in a table from Supabase
 * @param {string} tableName - The name of the table
 * @returns {Promise<Array>} - A promise that resolves to an array of column names
 */
async function getTableColumns(tableName) {
  try {
    // First try a simple query to test which columns exist
    const requiredColumns = ['subject', 'grade_level', 'chapter', 'page_number', 'content'];
    const optionalColumns = ['page_range', 'pdf_url', 'content_embedding'];

    console.log(`${colors.blue}Testing which columns exist in the ${tableName} table...${colors.reset}`);

    const columns = [];

    // Add required columns (these should always exist)
    columns.push(...requiredColumns);

    // Test each optional column by trying a simple query
    for (const column of optionalColumns) {
      try {
        const queryObj = {};
        queryObj[column] = true;

        const { error } = await supabase
          .from(tableName)
          .select(column)
          .limit(1);

        if (!error || (error && !error.message.includes(`column "${column}" does not exist`))) {
          columns.push(column);
          console.log(`${colors.green}Found column: ${column}${colors.reset}`);
        } else {
          console.log(`${colors.yellow}Column not found: ${column}${colors.reset}`);
        }
      } catch (columnError) {
        console.log(`${colors.yellow}Cannot determine if column exists: ${column}${colors.reset}`);
      }
    }

    return columns;
  } catch (error) {
    console.error(`${colors.red}Error detecting table columns: ${error.message}${colors.reset}`);

    // Fallback to basic required columns if we can't detect
    console.log(`${colors.yellow}Falling back to basic required columns${colors.reset}`);
    return ['subject', 'grade_level', 'chapter', 'page_number', 'content'];
  }
}

/**
 * Process a PDF textbook and import it into Supabase
 * @param {string} pdfPath - Path to the PDF file
 * @param {string} subject - Subject (mathematics or romanian)
 * @param {number} gradeLevel - Grade level (5-8)
 * @param {Object} options - Additional options
 */
async function importPDFTextbook(pdfPath, subject, gradeLevel, options = {}) {
  const { batchSize = 10, skipExisting = true, generateEmbeddings = false, chunkSize = 1 } = options;

  try {
    console.log(`${colors.blue}Importing ${subject} textbook for grade ${gradeLevel} from ${pdfPath}...${colors.reset}`);

    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found: ${pdfPath}`);
    }

    // Get the book title from the filename
    const bookTitle = path.basename(pdfPath, '.pdf').replace(/_/g, ' ');
    console.log(`${colors.blue}Book title: ${bookTitle}${colors.reset}`);

    // First check table structure to see which columns exist
    console.log(`${colors.blue}Checking database table structure...${colors.reset}`);
    const tableColumns = await getTableColumns('textbook_content');
    console.log(`${colors.green}Found columns: ${tableColumns.join(', ')}${colors.reset}`);

    // Extract text from the PDF
    const pages = await extractTextFromPDF(pdfPath);
    if (pages && pages.length > 0) {
      console.log(`${colors.cyan}Raw extracted text from first page:${colors.reset}\n${pages[0].text}\n`);
    }

    // Store the Firebase storage URL for reference
    // Format: gs://edupex-514dc.firebasestorage.app/Manuale/Clasa V/Matematica/file.pdf
    const gradeFolderName = `Clasa ${gradeLevel === 5 ? 'V' :
                             gradeLevel === 6 ? 'VI' :
                             gradeLevel === 7 ? 'VII' :
                             gradeLevel === 8 ? 'VIII' : gradeLevel}`;

    const subjectFolderName = subject === 'mathematics' ? 'Matematica' : 'Limba Romana';

    const firebaseURL = pdfPath.includes('://')
      ? pdfPath
      : `gs://edupex-514dc.firebasestorage.app/Manuale/${gradeFolderName}/${subjectFolderName}/${path.basename(pdfPath)}`;

    console.log(`${colors.blue}Processing ${pages.length} pages in batches of ${batchSize}...${colors.reset}`);

    // Process pages in chunks (combine multiple pages if chunkSize > 1)
    const chunks = [];
    for (let i = 0; i < pages.length; i += chunkSize) {
      const chunkPages = pages.slice(i, i + chunkSize);
      const startPage = chunkPages[0].pageNum;
      const endPage = chunkPages[chunkPages.length - 1].pageNum;
      const pageRange = startPage === endPage ? `${startPage}` : `${startPage}-${endPage}`;

      // Combine text from all pages in the chunk
      const combinedText = chunkPages.map(page => page.text).join(' ');

      if (combinedText.trim().length < 10) {
        console.log(`${colors.yellow}Skipping pages ${pageRange} - insufficient content${colors.reset}`);
        continue;
      }

      chunks.push({
        pageRange,
        startPage,
        endPage,
        text: combinedText
      });
    }

    // Process chunks in batches
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      console.log(`${colors.cyan}Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(chunks.length/batchSize)}...${colors.reset}`);

      // Process each chunk in parallel
      const promises = batch.map(async chunk => {
        try {
          // Check if this chunk already exists in the database
          if (skipExisting) {
            const { data: existingData, error: existingError } = await supabase
              .from('textbook_content')
              .select('id')
              .eq('subject', subject)
              .eq('grade_level', gradeLevel)
              .eq('chapter', bookTitle)
              .eq('page_number', chunk.startPage);

            if (!existingError && existingData && existingData.length > 0) {
              console.log(`${colors.yellow}Skipping pages ${chunk.pageRange} - already exists in database${colors.reset}`);
              skipCount++;
              return;
            }
          }

          // Generate embeddings if enabled
          let embedding = null;
          if (generateEmbeddings) {
            try {
              embedding = await getEmbedding(chunk.text);
            } catch (embeddingError) {
              console.log(`${colors.yellow}Warning: Could not generate embedding, proceeding without it: ${embeddingError.message}${colors.reset}`);
            }
          }

          // Create a data object with only the columns that exist in the table
          const insertData = {
            subject,
            grade_level: gradeLevel,
            chapter: bookTitle,
            page_number: chunk.startPage,
            content: sanitizeText(chunk.text) // Sanitize text before inserting
          };

          // Only add fields if they exist in the database table
          if (tableColumns.includes('page_range')) {
            insertData.page_range = chunk.pageRange;
          }

          if (tableColumns.includes('pdf_url')) {
            insertData.pdf_url = firebaseURL;
          }

          if (embedding && tableColumns.includes('content_embedding')) {
            insertData.content_embedding = embedding;
          }

          // Insert into Supabase
          const { error } = await supabase
            .from('textbook_content')
            .insert(insertData);

          if (error) {
            console.error(`${colors.red}Error inserting pages ${chunk.pageRange}: ${error.message}${colors.reset}`);
            failCount++;
          } else {
            console.log(`${colors.green}Successfully imported pages ${chunk.pageRange}${colors.reset}`);
            successCount++;
          }
        } catch (error) {
          console.error(`${colors.red}Error processing pages ${chunk.pageRange}: ${error.message}${colors.reset}`);
          failCount++;
        }
      });

      // Wait for all chunks in the batch to be processed
      await Promise.all(promises);

      // Brief pause between batches
      if (i + batchSize < chunks.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`${colors.green}Import completed!${colors.reset}`);
    console.log(`${colors.blue}Summary:${colors.reset}`);
    console.log(`${colors.green}- Successfully imported: ${successCount} page chunks${colors.reset}`);
    console.log(`${colors.yellow}- Skipped: ${skipCount} page chunks${colors.reset}`);
    console.log(`${colors.red}- Failed: ${failCount} page chunks${colors.reset}`);

  } catch (error) {
    console.error(`${colors.red}Error importing textbook: ${error.message}${colors.reset}`);
    throw error;
  }
}

/**
 * Recursively process a folder structure to import multiple PDFs
 * @param {string} rootDir - Path to the root directory
 * @param {Object} options - Import options
 */
async function processFolder(rootDir, options = {}) {
  try {
    if (!fs.existsSync(rootDir)) {
      throw new Error(`Directory not found: ${rootDir}`);
    }

    console.log(`${colors.blue}Processing directory: ${rootDir}${colors.reset}`);

    const items = fs.readdirSync(rootDir);

    // Process all items in the directory
    for (const item of items) {
      const itemPath = path.join(rootDir, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        // For directories, check if it's a grade or subject folder
        const gradeLevel = getGradeLevel(item);
        const subject = getSubject(item);

        if (gradeLevel) {
          console.log(`${colors.cyan}Found grade folder: ${item} (Grade ${gradeLevel})${colors.reset}`);
          // This is a grade folder, process its subdirectories
          await processFolder(itemPath, { ...options, gradeLevel });
        } else if (subject) {
          console.log(`${colors.cyan}Found subject folder: ${item} (${subject})${colors.reset}`);
          // This is a subject folder, process its PDFs
          await processFolder(itemPath, { ...options, subject });
        } else {
          // Regular directory, just process recursively
          await processFolder(itemPath, options);
        }
      } else if (stats.isFile() && item.toLowerCase().endsWith('.pdf')) {
        // For PDF files, determine grade and subject if not already set
        const gradeLevel = options.gradeLevel || getGradeLevel(path.dirname(itemPath));
        const subject = options.subject || getSubject(path.dirname(itemPath));

        if (!gradeLevel || !subject) {
          console.log(`${colors.yellow}Skipping ${item} - Unable to determine grade level or subject${colors.reset}`);
          continue;
        }

        // Import the PDF
        console.log(`${colors.blue}Found PDF: ${item} (${subject}, Grade ${gradeLevel})${colors.reset}`);
        await importPDFTextbook(itemPath, subject, gradeLevel, options);
      }
    }
  } catch (error) {
    console.error(`${colors.red}Error processing folder: ${error.message}${colors.reset}`);
    throw error;
  }
}

/**
 * Create the textbook_content table in Supabase if it doesn't exist
 * @returns {Promise<void>}
 */
async function createTextbookContentTable() {
  console.log(`${colors.blue}Checking for textbook_content table in Supabase...${colors.reset}`);

  try {
    // First check if the table exists by trying to select from it
    const { error: checkError } = await supabase
      .from('textbook_content')
      .select('count')
      .limit(1);

    // If the table doesn't exist, we'll get a specific error
    if (checkError && checkError.message.includes('does not exist')) {
      console.log(`${colors.yellow}Table 'textbook_content' doesn't exist yet.${colors.reset}`);
      console.log(`${colors.yellow}Table will be created automatically when inserting data.${colors.reset}`);

      // Let's try a more basic approach - create an initial row to force table creation
      // with minimum required columns
      const initialData = {
        subject: 'initialization',
        grade_level: 0,
        chapter: 'initialization',
        page_number: 0,
        content: 'This is a placeholder row to initialize the table structure.'
      };

      console.log(`${colors.blue}Attempting to create table by inserting initial data...${colors.reset}`);

      const { error: insertError } = await supabase
        .from('textbook_content')
        .insert(initialData);

      if (insertError && !insertError.message.includes('already exists')) {
        console.log(`${colors.yellow}Note: Could not create table through insertion: ${insertError.message}${colors.reset}`);
        console.log(`${colors.yellow}Will try again during normal data insertion.${colors.reset}`);
      } else {
        console.log(`${colors.green}Successfully initialized textbook_content table${colors.reset}`);

        // If successful, delete the initialization row
        const { error: deleteError } = await supabase
          .from('textbook_content')
          .delete()
          .eq('subject', 'initialization')
          .eq('chapter', 'initialization');

        if (deleteError) {
          console.log(`${colors.yellow}Note: Could not remove initialization row: ${deleteError.message}${colors.reset}`);
        }
      }
    } else if (checkError) {
      // Some other error occurred when checking the table
      console.log(`${colors.yellow}Note: Error checking table: ${checkError.message}${colors.reset}`);
      console.log(`${colors.yellow}Will attempt to use the table anyway.${colors.reset}`);
    } else {
      // Table exists
      console.log(`${colors.green}Successfully connected to textbook_content table${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.yellow}Could not verify table existence: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}Will attempt to create it when inserting data${colors.reset}`);
  }
}

/**
 * Sanitize text to remove invalid Unicode escape sequences
 * @param {string} text - The text to sanitize
 * @returns {string} - The sanitized text
 */
function sanitizeText(text) {
  if (!text) return '';

  try {
    // Remove only control characters, preserve all Unicode letters
    let sanitized = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
    // Optionally, trim and normalize
    sanitized = sanitized.trim().normalize('NFC');
    // Test if the string is valid JSON when wrapped in quotes
    JSON.parse('"' + sanitized.replace(/"/g, '\\"') + '"');

    return sanitized;
  } catch (e) {
    // If sanitization fails, just return the normalized text
    return text.trim().normalize('NFC');
  }
}

/**
 * Command line interface for importing PDFs
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
${colors.blue}PDF Textbook Import Utility${colors.reset}
This tool imports PDF textbooks into Supabase for use with AI assistants.

${colors.cyan}Usage:${colors.reset}
  1. Import a single PDF:
     node importPDFTextbooks.js --pdf <pdfPath> --subject <subject> --grade <gradeLevel>

  2. Import a folder of PDFs (with auto-detection of subjects and grades):
     node importPDFTextbooks.js --folder <folderPath>

${colors.cyan}Options:${colors.reset}
  --pdf <path>          Path to a single PDF file
  --folder <path>       Path to a folder containing PDFs (will scan recursively)
  --subject <subject>   Subject area: "mathematics" or "romanian" (only needed for single PDF)
  --grade <level>       School grade level: 5, 6, 7, or 8 (only needed for single PDF)
  --no-embeddings       Skip embedding generation (faster import)
  --batch <size>        Number of chunks to process in parallel (default: 10)
  --chunk <size>        Number of pages per chunk (default: 1)
  --force               Import all chunks, even if they already exist in the database

${colors.cyan}Examples:${colors.reset}
  node importPDFTextbooks.js --pdf ./Clasa-V-Matematica-Editura-ArtKlett.pdf --subject mathematics --grade 5
  node importPDFTextbooks.js --folder ./Manuale --no-embeddings --chunk 2
    `);
    process.exit(1);
  }

  // Parse options
  const options = {
    batchSize: 10,
    skipExisting: true,
    generateEmbeddings: false,
    chunkSize: 1
  };

  let pdfPath = null;
  let folderPath = null;
  let subject = null;
  let gradeLevel = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--pdf' && i + 1 < args.length) {
      pdfPath = args[++i];
    } else if (arg === '--folder' && i + 1 < args.length) {
      folderPath = args[++i];
    } else if (arg === '--subject' && i + 1 < args.length) {
      subject = args[++i];
    } else if (arg === '--grade' && i + 1 < args.length) {
      gradeLevel = parseInt(args[++i]);
    } else if (arg === '--no-embeddings') {
      options.generateEmbeddings = false;
    } else if (arg === '--force') {
      options.skipExisting = false;
    } else if (arg === '--batch' && i + 1 < args.length) {
      options.batchSize = parseInt(args[++i]) || 10;
    } else if (arg === '--chunk' && i + 1 < args.length) {
      options.chunkSize = parseInt(args[++i]) || 1;
    }
  }

  // Validate subject
  if (subject && !['mathematics', 'romanian'].includes(subject)) {
    console.error(`${colors.red}Subject must be either "mathematics" or "romanian"${colors.reset}`);
    process.exit(1);
  }

  // Validate grade level
  if (gradeLevel && ![5, 6, 7, 8].includes(gradeLevel)) {
    console.error(`${colors.red}Grade level must be between 5 and 8${colors.reset}`);
    process.exit(1);
  }

  // Show configuration
  console.log(`${colors.blue}Configuration:${colors.reset}`);

  if (pdfPath) {
    console.log(`- PDF File: ${pdfPath}`);
    console.log(`- Subject: ${subject}`);
    console.log(`- Grade Level: ${gradeLevel}`);
  } else if (folderPath) {
    console.log(`- Folder Path: ${folderPath}`);
    console.log(`- Recursive: Yes`);
  }

  console.log(`- Pages per Chunk: ${options.chunkSize}`);
  console.log(`- Batch Size: ${options.batchSize}`);
  console.log(`- Skip Existing: ${options.skipExisting ? 'Yes' : 'No'}`);
  console.log(`- Generate Embeddings: ${options.generateEmbeddings ? 'Yes' : 'No'}`);

  // Check Supabase connection
  try {
    // Use a simpler way to check connection - just try to get server time
    console.log(`${colors.blue}Checking connection to Supabase...${colors.reset}`);

    // Try to get a simple health check from Supabase
    const { data, error } = await supabase.from('textbook_content').select('count').limit(1);

    // If textbook_content doesn't exist yet, that's fine - we'll create it
    if (error && error.message.includes('does not exist')) {
      console.log(`${colors.yellow}Table 'textbook_content' doesn't exist yet. Will create it.${colors.reset}`);
      // This confirms our connection is working, we just need to create the table
      console.log(`${colors.green}Successfully connected to Supabase${colors.reset}`);
      await createTextbookContentTable();
    } else if (error) {
      // Some other error occurred
      console.error(`${colors.red}Error connecting to Supabase: ${error.message}${colors.reset}`);

      // Try a very basic health check as last resort
      try {
        const { data, error: healthError } = await supabase.rpc('dbtime');
        if (healthError) {
          console.error(`${colors.red}Failed basic health check: ${healthError.message}${colors.reset}`);
          console.error(`${colors.red}Please check your Supabase configuration in the .env file.${colors.reset}`);
          process.exit(1);
        } else {
          console.log(`${colors.green}Successfully connected to Supabase${colors.reset}`);
        }
      } catch (healthCheckError) {
        console.error(`${colors.red}Failed to connect to Supabase: ${healthCheckError.message}${colors.reset}`);
        console.error(`${colors.red}Please check your Supabase configuration in the .env file.${colors.reset}`);
        process.exit(1);
      }
    } else {
      console.log(`${colors.green}Successfully connected to Supabase${colors.reset}`);
    }

    // Now try to create the textbook_content table if it doesn't exist
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS textbook_content (
        id BIGSERIAL PRIMARY KEY,
        subject TEXT NOT NULL,
        grade_level INTEGER NOT NULL,
        chapter TEXT NOT NULL,
        page_number INTEGER,
        page_range TEXT,
        content TEXT NOT NULL,
        content_embedding vector(1536),
        pdf_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ
      )
    `;

    try {
      // Try to execute SQL directly (may not work depending on permissions)
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql_string: createTableSQL
      });

      if (createError) {
        console.log(`${colors.yellow}Note: Could not create table through RPC: ${createError.message}${colors.reset}`);
        console.log(`${colors.yellow}Will attempt to create the table when inserting data${colors.reset}`);
      } else {
        console.log(`${colors.green}Successfully prepared textbook_content table${colors.reset}`);

        // Create indexes if table was created
        await supabase.rpc('exec_sql', {
          sql_string: `
            CREATE INDEX IF NOT EXISTS idx_textbook_content_subject_grade
            ON textbook_content(subject, grade_level);

            CREATE INDEX IF NOT EXISTS idx_textbook_content_chapter
            ON textbook_content(chapter);
          `
        });
      }
    } catch (tableError) {
      console.log(`${colors.yellow}Will try to create the table when inserting data${colors.reset}`);
    }

  } catch (err) {
    console.error(`${colors.red}Failed to connect to Supabase: ${err.message}${colors.reset}`);
    process.exit(1);
  }

  try {
    if (pdfPath) {
      // Import single PDF
      if (!subject || !gradeLevel) {
        console.error(`${colors.red}Subject and grade level are required for single PDF import${colors.reset}`);
        process.exit(1);
      }

      await importPDFTextbook(pdfPath, subject, gradeLevel, options);
    } else if (folderPath) {
      // Process folder recursively
      await processFolder(folderPath, options);
    } else {
      console.error(`${colors.red}Either --pdf or --folder option must be specified${colors.reset}`);
      process.exit(1);
    }

    console.log(`${colors.green}Import completed successfully!${colors.reset}`);
  } catch (err) {
    console.error(`${colors.red}Import failed: ${err.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(err => {
    console.error(`${colors.red}Unhandled error: ${err.message}${colors.reset}`);
    process.exit(1);
  });
} else {
  // Export for use as module
  module.exports = { importPDFTextbook, processFolder, extractTextFromPDF, getEmbedding };
}
