// Simple script to check Supabase textbook_content table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('Starting Supabase check...');

// Use the Supabase URL and key from environment variables only
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Log what we're using
console.log('Using Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Using Supabase Key:', supabaseKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file');
  console.error('Please create a .env file in the backend directory with your Supabase credentials');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase client initialized');

// Check for the textbook_content table
async function checkTextbookTable() {
  try {
    console.log('Checking for textbook_content table...');
    const { data, error } = await supabase
      .from('textbook_content')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.error('Error querying textbook_content:', error.message);
      return;
    }

    console.log('Textbook content table exists!');
    console.log('Record count:', data[0].count);
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

// Run the check
checkTextbookTable();
