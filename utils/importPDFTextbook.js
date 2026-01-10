const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { PDFDocument, PDFPage } = require('pdf-lib');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const OpenAI = require('openai');
require('dotenv').config();

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

// Get worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(__dirname, 'pdf.worker.js');

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
 * Extract text from a PDF file
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<Array>} - Array of objects with page number and text
 */
async function extractTextFromPDF(pdfPath) {
  try {
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;

    console.log(`${colors.blue}PDF loaded successfully. Total pages: ${pdf.numPages}${colors.reset}`);

    const pages = [];

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Combine all text items on the page
        const text = textContent.items.map(item => item.str).join(' ');

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

    return pages;
  } catch (error) {
    console.error(`${colors.red}Error processing PDF: ${error.message}${colors.reset}`);
    throw error;
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
  const { batchSize = 10, skipExisting = true, generateEmbeddings = true, chunkSize = 1 } = options;

  try {
    console.log(`${colors.blue}Importing ${subject} textbook for grade ${gradeLevel} from ${pdfPath}...${colors.reset}`);

    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found: ${pdfPath}`);
    }

    // Get the book title from the filename
    const bookTitle = path.basename(pdfPath, '.pdf').replace(/_/g, ' ');
    console.log(`${colors.blue}Book title: ${bookTitle}${colors.reset}`);

    // Extract text from the PDF
    const pages = await extractTextFromPDF(pdfPath);

    // Store the Firebase storage URL for reference
    const firebaseURL = pdfPath.includes('://')
      ? pdfPath
      : `gs://edupex-514dc.firebasestorage.app/Manuale/Clasa ${gradeLevel}/${subject}/${path.basename(pdfPath)}`;

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
            embedding = await getEmbedding(chunk.text);
          }

          // Insert into Supabase
          const { error } = await supabase
            .from('textbook_content')
            .insert({
              subject,
              grade_level: gradeLevel,
              chapter: bookTitle,
              page_number: chunk.startPage,
              page_range: chunk.pageRange,
              content: chunk.text,
              content_embedding: embedding,
              pdf_url: firebaseURL
            });

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
 * Command line interface for importing PDF textbooks
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log(`
${colors.blue}PDF Textbook Import Utility${colors.reset}
This tool imports PDF textbooks into Supabase for use with AI assistants.

${colors.cyan}Usage:${colors.reset}
  node importPDFTextbook.js <pdfPath> <subject> <gradeLevel> [options]

${colors.cyan}Arguments:${colors.reset}
  pdfPath       Path to the PDF file
  subject       Subject area: "mathematics" or "romanian"
  gradeLevel    School grade level: 5, 6, 7, or 8

${colors.cyan}Options:${colors.reset}
  --no-embeddings    Skip embedding generation (faster import)
  --batch=<size>     Number of chunks to process in parallel (default: 10)
  --chunk=<size>     Number of pages per chunk (default: 1)
  --force            Import all chunks, even if they already exist in the database

${colors.cyan}Examples:${colors.reset}
  node importPDFTextbook.js ./Clasa-V-Matematica-Editura-ArtKlett.pdf mathematics 5
  node importPDFTextbook.js ./romana_manual.pdf romanian 7 --no-embeddings --chunk=2
    `);
    process.exit(1);
  }

  const [pdfPath, subject, gradeLevelStr] = args;
  const gradeLevel = parseInt(gradeLevelStr);

  // Parse options
  const options = {
    batchSize: 10,
    skipExisting: true,
    generateEmbeddings: true,
    chunkSize: 1
  };

  args.slice(3).forEach(arg => {
    if (arg === '--no-embeddings') {
      options.generateEmbeddings = false;
    } else if (arg === '--force') {
      options.skipExisting = false;
    } else if (arg.startsWith('--batch=')) {
      options.batchSize = parseInt(arg.split('=')[1]) || 10;
    } else if (arg.startsWith('--chunk=')) {
      options.chunkSize = parseInt(arg.split('=')[1]) || 1;
    }
  });

  // Validate arguments
  if (!['mathematics', 'romanian'].includes(subject)) {
    console.error(`${colors.red}Subject must be either "mathematics" or "romanian"${colors.reset}`);
    process.exit(1);
  }

  if (![5, 6, 7, 8].includes(gradeLevel)) {
    console.error(`${colors.red}Grade level must be between 5 and 8${colors.reset}`);
    process.exit(1);
  }

  // Show configuration
  console.log(`${colors.blue}Configuration:${colors.reset}`);
  console.log(`- PDF File: ${pdfPath}`);
  console.log(`- Subject: ${subject}`);
  console.log(`- Grade Level: ${gradeLevel}`);
  console.log(`- Pages per Chunk: ${options.chunkSize}`);
  console.log(`- Batch Size: ${options.batchSize}`);
  console.log(`- Skip Existing: ${options.skipExisting ? 'Yes' : 'No'}`);
  console.log(`- Generate Embeddings: ${options.generateEmbeddings ? 'Yes' : 'No'}`);

  // Check Supabase connection
  try {
    const { data, error } = await supabase.from('textbook_content').select('count(*)');
    if (error) {
      console.error(`${colors.red}Error connecting to Supabase: ${error.message}${colors.reset}`);
      console.error(`${colors.red}Please check your Supabase configuration in the .env file.${colors.reset}`);
      process.exit(1);
    }
    console.log(`${colors.green}Successfully connected to Supabase${colors.reset}`);
    console.log(`${colors.blue}Current record count in textbook_content: ${data[0].count}${colors.reset}`);
  } catch (err) {
    console.error(`${colors.red}Failed to connect to Supabase: ${err.message}${colors.reset}`);
    process.exit(1);
  }

  try {
    await importPDFTextbook(pdfPath, subject, gradeLevel, options);
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
  module.exports = { importPDFTextbook, extractTextFromPDF, getEmbedding };
}
