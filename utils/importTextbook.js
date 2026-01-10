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
 * Process OCR text files and import them into Supabase
 * @param {string} directory - Directory containing the OCR text files
 * @param {string} subject - Subject (mathematics or romanian)
 * @param {number} gradeLevel - Grade level (5-8)
 * @param {Object} options - Additional options
 */
async function importTextbookContent(directory, subject, gradeLevel, options = {}) {
  const { batchSize = 10, skipExisting = true, generateEmbeddings = true } = options;

  try {
    console.log(`${colors.blue}Importing ${subject} textbook content for grade ${gradeLevel} from ${directory}...${colors.reset}`);

    // Check if directory exists
    if (!fs.existsSync(directory)) {
      throw new Error(`Directory not found: ${directory}`);
    }

    // Get all text files in the directory
    const files = fs.readdirSync(directory).filter(file => file.endsWith('.txt'));

    console.log(`${colors.blue}Found ${files.length} text files to process${colors.reset}`);

    // Process files in batches
    let processedCount = 0;
    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      console.log(`${colors.cyan}Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(files.length/batchSize)}...${colors.reset}`);

      // Process each file in parallel
      const promises = batch.map(async file => {
        try {
          // Extract page number and chapter from filename
          // Expected format: chapter_name-page_number.txt (e.g., "ecuatii_de_gradul_doi-47.txt")
          const fileInfo = path.parse(file).name.split('-');
          const chapter = fileInfo[0].replace(/_/g, ' ');
          const pageNumber = fileInfo.length > 1 ? parseInt(fileInfo[1]) : null;

          // Check if this page already exists in the database
          if (skipExisting) {
            const { data: existingData, error: existingError } = await supabase
              .from('textbook_content')
              .select('id')
              .eq('subject', subject)
              .eq('grade_level', gradeLevel)
              .eq('chapter', chapter)
              .eq('page_number', pageNumber);

            if (!existingError && existingData && existingData.length > 0) {
              console.log(`${colors.yellow}Skipping ${file} - already exists in database${colors.reset}`);
              skippedCount++;
              return;
            }
          }

          // Read file content
          const content = fs.readFileSync(path.join(directory, file), 'utf8');

          if (content.trim().length < 10) {
            console.log(`${colors.yellow}Skipping ${file} - insufficient content${colors.reset}`);
            skippedCount++;
            return;
          }

          console.log(`Processing ${file}: ${chapter}, page ${pageNumber}`);

          // Generate embeddings for the content if enabled
          let embedding = null;
          if (generateEmbeddings) {
            embedding = await getEmbedding(content);
          }

          // Insert into Supabase
          const { data, error } = await supabase
            .from('textbook_content')
            .insert({
              subject,
              grade_level: gradeLevel,
              chapter,
              page_number: pageNumber,
              content,
              content_embedding: embedding
            });

          if (error) {
            console.error(`${colors.red}Error inserting ${file}: ${error.message}${colors.reset}`);
            failCount++;
          } else {
            console.log(`${colors.green}Successfully imported ${file}${colors.reset}`);
            successCount++;
          }
        } catch (error) {
          console.error(`${colors.red}Error processing ${file}: ${error.message}${colors.reset}`);
          failCount++;
        }

        processedCount++;
      });

      // Wait for all files in the batch to be processed
      await Promise.all(promises);

      // Brief pause between batches to avoid rate limits
      if (i + batchSize < files.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`${colors.green}Import completed!${colors.reset}`);
    console.log(`${colors.blue}Summary:${colors.reset}`);
    console.log(`${colors.green}- Successfully imported: ${successCount}${colors.reset}`);
    console.log(`${colors.yellow}- Skipped: ${skippedCount}${colors.reset}`);
    console.log(`${colors.red}- Failed: ${failCount}${colors.reset}`);

  } catch (error) {
    console.error(`${colors.red}Error importing textbook content: ${error.message}${colors.reset}`);
  }
}

/**
 * Command line interface for importing textbook content
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log(`
${colors.blue}Textbook Content Import Utility${colors.reset}
This tool imports OCR-processed textbook content into Supabase for use with AI assistants.

${colors.cyan}Usage:${colors.reset}
  node importTextbook.js <directory> <subject> <gradeLevel> [options]

${colors.cyan}Arguments:${colors.reset}
  directory    Path to the folder containing text files
  subject      Subject area: "mathematics" or "romanian"
  gradeLevel   School grade level: 5, 6, 7, or 8

${colors.cyan}Options:${colors.reset}
  --no-embeddings    Skip embedding generation (faster import)
  --batch=<size>     Number of files to process in parallel (default: 10)
  --force            Import all files, even if they already exist in the database

${colors.cyan}Examples:${colors.reset}
  node importTextbook.js ./math_textbooks/grade5 mathematics 5
  node importTextbook.js ./romana_manuale/clasa7 romanian 7 --no-embeddings
    `);
    process.exit(1);
  }

  const [directory, subject, gradeLevelStr] = args;
  const gradeLevel = parseInt(gradeLevelStr);

  // Parse options
  const options = {
    batchSize: 10,
    skipExisting: true,
    generateEmbeddings: true
  };

  args.slice(3).forEach(arg => {
    if (arg === '--no-embeddings') {
      options.generateEmbeddings = false;
    } else if (arg === '--force') {
      options.skipExisting = false;
    } else if (arg.startsWith('--batch=')) {
      options.batchSize = parseInt(arg.split('=')[1]) || 10;
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
  console.log(`- Directory: ${directory}`);
  console.log(`- Subject: ${subject}`);
  console.log(`- Grade Level: ${gradeLevel}`);
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

  await importTextbookContent(directory, subject, gradeLevel, options);
}

// Run if called directly
if (require.main === module) {
  main().catch(err => {
    console.error(`${colors.red}Unhandled error: ${err.message}${colors.reset}`);
    process.exit(1);
  });
} else {
  // Export for use as module
  module.exports = { importTextbookContent, getEmbedding };
}
