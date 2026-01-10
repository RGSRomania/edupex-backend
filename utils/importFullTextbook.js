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
 * Import a full textbook file (PDF or text) into Supabase
 * @param {string} filePath - Path to the textbook file
 * @param {string} subject - Subject (mathematics or romanian)
 * @param {number} gradeLevel - Grade level (5-8)
 * @param {Object} options - Additional options
 */
async function importFullTextbook(filePath, subject, gradeLevel, options = {}) {
  const { generateEmbeddings = true } = options;

  try {
    console.log(`${colors.blue}Importing full ${subject} textbook for grade ${gradeLevel}...${colors.reset}`);
    console.log(`${colors.blue}File: ${filePath}${colors.reset}`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Get the file extension
    const extension = path.extname(filePath).toLowerCase();

    // Read file content based on type
    let content = '';

    if (extension === '.txt') {
      // For text files, simply read the content
      content = fs.readFileSync(filePath, 'utf8');
      console.log(`${colors.green}Successfully read text file, ${content.length} characters${colors.reset}`);
    } else {
      throw new Error(`Unsupported file type: ${extension}. Please convert to .txt first.`);
    }

    if (content.trim().length < 10) {
      throw new Error('File content is too short, possibly empty or invalid');
    }

    // Get file name without extension as chapter name
    const chapter = path.basename(filePath, extension).replace(/_/g, ' ');

    // Generate embeddings for the content if enabled
    let embedding = null;
    if (generateEmbeddings) {
      console.log(`${colors.cyan}Generating embeddings for content...${colors.reset}`);
      embedding = await getEmbedding(content);
      if (embedding) {
        console.log(`${colors.green}Successfully generated embeddings${colors.reset}`);
      }
    }

    // Check if this textbook already exists
    const { data: existingData, error: existingError } = await supabase
      .from('textbook_content')
      .select('id')
      .eq('subject', subject)
      .eq('grade_level', gradeLevel)
      .eq('chapter', chapter);

    if (!existingError && existingData && existingData.length > 0) {
      console.log(`${colors.yellow}Updating existing textbook entry for ${subject} grade ${gradeLevel}, ${chapter}${colors.reset}`);

      // Update existing entry
      const { error } = await supabase
        .from('textbook_content')
        .update({
          content,
          content_embedding: embedding,
          updated_at: new Date().toISOString()
        })
        .eq('subject', subject)
        .eq('grade_level', gradeLevel)
        .eq('chapter', chapter);

      if (error) {
        throw new Error(`Error updating textbook content: ${error.message}`);
      }

      console.log(`${colors.green}Successfully updated textbook content${colors.reset}`);
    } else {
      console.log(`${colors.blue}Creating new textbook entry${colors.reset}`);

      // Insert new entry
      const { error } = await supabase
        .from('textbook_content')
        .insert({
          subject,
          grade_level: gradeLevel,
          chapter,
          content,
          content_embedding: embedding
        });

      if (error) {
        throw new Error(`Error inserting textbook content: ${error.message}`);
      }

      console.log(`${colors.green}Successfully imported textbook content${colors.reset}`);
    }

  } catch (error) {
    console.error(`${colors.red}Error importing textbook: ${error.message}${colors.reset}`);
    throw error;
  }
}

/**
 * Command line interface for importing full textbooks
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log(`
${colors.blue}Full Textbook Import Utility${colors.reset}
This tool imports a complete textbook file into Supabase for use with AI assistants.

${colors.cyan}Usage:${colors.reset}
  node importFullTextbook.js <filePath> <subject> <gradeLevel> [options]

${colors.cyan}Arguments:${colors.reset}
  filePath      Path to the textbook file (.txt)
  subject       Subject area: "mathematics" or "romanian"
  gradeLevel    School grade level: 5, 6, 7, or 8

${colors.cyan}Options:${colors.reset}
  --no-embeddings    Skip embedding generation (faster import)

${colors.cyan}Examples:${colors.reset}
  node importFullTextbook.js ./math_textbooks/algebra_grade8.txt mathematics 8
  node importFullTextbook.js ./romana_manuale/literatura_clasa7.txt romanian 7 --no-embeddings
    `);
    process.exit(1);
  }

  const [filePath, subject, gradeLevelStr] = args;
  const gradeLevel = parseInt(gradeLevelStr);

  // Parse options
  const options = {
    generateEmbeddings: true
  };

  args.slice(3).forEach(arg => {
    if (arg === '--no-embeddings') {
      options.generateEmbeddings = false;
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
  console.log(`- File: ${filePath}`);
  console.log(`- Subject: ${subject}`);
  console.log(`- Grade Level: ${gradeLevel}`);
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
    await importFullTextbook(filePath, subject, gradeLevel, options);
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
  module.exports = { importFullTextbook, getEmbedding };
}
