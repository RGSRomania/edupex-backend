// Utility script to explore and manage your Supabase database
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://szbjppcmhshegyewsveu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Available commands
const commands = {
  'list-tables': listTables,
  'show-schema': showSchema,
  'clear-table': clearTable,
  'import-sample': importSample,
  'test-query': testQuery
};

// Main function
async function main() {
  const command = process.argv[2];

  if (!command || !commands[command]) {
    console.log('Available commands:');
    Object.keys(commands).forEach(cmd => console.log(`  - ${cmd}`));
    process.exit(1);
  }

  try {
    await commands[command]();
  } catch (error) {
    console.error('Error:', error);
  }
}

// List all tables in the database
async function listTables() {
  console.log('Listing tables in your Supabase database...');

  try {
    // Query information schema for tables
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) throw error;

    if (data && data.length > 0) {
      console.log('Available tables:');
      data.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    } else {
      console.log('No tables found in the public schema.');
    }
  } catch (error) {
    console.error('Error listing tables:', error.message);

    // Alternative approach if information_schema access is restricted
    console.log('Trying alternative approach...');
    try {
      const { data, error } = await supabase
        .from('textbook_content')
        .select('count(*)');

      if (error) {
        if (error.message.includes('does not exist')) {
          console.log('The textbook_content table does not exist yet.');
          console.log('You need to run the SQL migration script to create it.');
        } else {
          throw error;
        }
      } else {
        console.log('Found textbook_content table with', data[0].count, 'records');
      }
    } catch (innerError) {
      console.error('Alternative approach failed:', innerError.message);
    }
  }
}

// Show the schema of a table
async function showSchema() {
  const tableName = process.argv[3] || 'textbook_content';
  console.log(`Showing schema for table: ${tableName}`);

  try {
    // Query information schema for column details
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);

    if (error) throw error;

    if (data && data.length > 0) {
      console.log(`Columns in ${tableName}:`);
      data.forEach(column => {
        console.log(`  - ${column.column_name} (${column.data_type}, ${column.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
      });
    } else {
      console.log(`No schema found for table: ${tableName}`);
    }
  } catch (error) {
    console.error('Error showing schema:', error.message);
  }
}

// Clear all records from a table
async function clearTable() {
  const tableName = process.argv[3] || 'textbook_content';

  // Confirmation check
  if (process.argv[4] !== '--confirm') {
    console.log(`WARNING: This will delete ALL records from the '${tableName}' table.`);
    console.log('To confirm, run the command again with the --confirm flag:');
    console.log(`node exploreSupabase.js clear-table ${tableName} --confirm`);
    return;
  }

  console.log(`Clearing all records from table: ${tableName}`);

  try {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .neq('id', 0); // This will delete all records

    if (error) throw error;

    console.log(`Successfully cleared the ${tableName} table.`);
  } catch (error) {
    console.error('Error clearing table:', error.message);
  }
}

// Import a sample text file
async function importSample() {
  const sampleFile = path.resolve(__dirname, 'sample_textbooks/ecuatii_de_gradul_doi-47.txt');

  if (!fs.existsSync(sampleFile)) {
    console.error('Sample file not found:', sampleFile);
    return;
  }

  console.log('Importing sample textbook page about quadratic equations...');

  try {
    // Read file content
    const content = fs.readFileSync(sampleFile, 'utf8');
    const chapter = 'ecuatii de gradul doi';
    const pageNumber = 47;

    // Import into Supabase
    const { data, error } = await supabase
      .from('textbook_content')
      .insert({
        subject: 'mathematics',
        grade_level: 8, // Assuming this is 8th grade math
        chapter: chapter,
        page_number: pageNumber,
        content: content
      });

    if (error) throw error;

    console.log('Successfully imported sample textbook page!');
  } catch (error) {
    console.error('Error importing sample:', error.message);
  }
}

// Test querying the textbook content with a sample question
async function testQuery() {
  const query = process.argv[3] || 'ecuatia de gradul 2';
  console.log(`Testing a query for: "${query}"`);

  try {
    // Simple text search
    const { data, error } = await supabase
      .from('textbook_content')
      .select('*')
      .textSearch('content', query);

    if (error) throw error;

    if (data && data.length > 0) {
      console.log(`Found ${data.length} matching textbook pages:`);
      data.forEach(item => {
        console.log(`- ${item.chapter}, page ${item.page_number}:`);

        // Get a snippet of the content around the matching term
        const contentLower = item.content.toLowerCase();
        const queryLower = query.toLowerCase();
        const index = contentLower.indexOf(queryLower);

        if (index >= 0) {
          const start = Math.max(0, index - 50);
          const end = Math.min(item.content.length, index + queryLower.length + 50);
          const snippet = item.content.substring(start, end);
          console.log(`  "...${snippet}..."`);
        } else {
          console.log(`  "${item.content.substring(0, 100)}..."`);
        }
        console.log();
      });
    } else {
      console.log('No matching content found.');
    }
  } catch (error) {
    console.error('Error querying textbook content:', error.message);
  }
}

// Run the script
main();
