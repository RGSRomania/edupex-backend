// Test script to check Supabase connection and data
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load env from explicit path
const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

console.log('Script started');
console.log('Current directory:', __dirname);
console.log('Environment file path:', envPath);
console.log('Environment file exists:', fs.existsSync(envPath) ? 'Yes' : 'No');
console.log('Dotenv result:', result.error ? `Error: ${result.error.message}` : 'Success');

async function checkSupabase() {
  try {
    // Get Supabase credentials from environment
    let supabaseUrl = process.env.SUPABASE_URL;
    let supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    // Log environment info
    console.log('SUPABASE_URL:', supabaseUrl ? 'Configured' : 'Missing');
    console.log('SUPABASE_SERVICE_KEY:', supabaseKey ? 'Configured' : 'Missing');

    if (!supabaseUrl || !supabaseKey) {
      console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file');
      console.error('Please create a .env file in the backend directory with your Supabase credentials');
      process.exit(1);
    }

    // Initialize Supabase client
    console.log('Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if Supabase is accessible
    console.log('Checking Supabase connection...');
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('*')
      .limit(1);

    if (tablesError) {
      console.error('Error connecting to Supabase:', tablesError.message);
    } else {
      console.log('Successfully connected to Supabase');
    }

    // Try to query for textbook_content
    console.log('Trying to query textbook_content table...');
    const { data, error } = await supabase
      .from('textbook_content')
      .select('*')
      .limit(5);

    if (error) {
      console.error('Error fetching textbook content:', error.message);

      // If table doesn't exist, suggest creating it
      if (error.message.includes('does not exist')) {
        console.log('The textbook_content table does not exist yet. You need to run the SQL migration script.');
      }
    } else {
      console.log(`Found ${data.length} records in textbook_content table`);
      if (data.length > 0) {
        console.log('Sample record:', {
          subject: data[0].subject,
          grade_level: data[0].grade_level,
          chapter: data[0].chapter,
          page_number: data[0].page_number,
          content: data[0].content ? data[0].content.substring(0, 100) + '...' : 'No content'
        });
      } else {
        console.log('The textbook_content table exists but is empty. You need to import your textbook data.');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkSupabase().then(() => console.log('Done'));
