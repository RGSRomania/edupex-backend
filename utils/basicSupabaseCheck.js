// Super simple Supabase connection check
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Load credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file');
  console.error('Please create a .env file in the backend directory with your Supabase credentials');
  process.exit(1);
}

console.log('Script started');
console.log('Will attempt to connect to Supabase at:', supabaseUrl);

async function basicCheck() {
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Attempting a simple query...');
    // Simplest possible query - fetching database server time
    const { data, error } = await supabase.rpc('now');

    if (error) {
      console.error('Query failed with error:', error.message);
      return;
    }

    console.log('Connection successful! Server time:', data);
    console.log('Your Supabase instance is working correctly.');

    // Now try to create the textbook_content table if it doesn't exist
    try {
      console.log('Checking if textbook_content table exists...');
      const { data: tableData, error: tableError } = await supabase
        .from('textbook_content')
        .select('count(*)')
        .limit(1);

      if (tableError) {
        if (tableError.message.includes('does not exist')) {
          console.log('Table does not exist. You need to create it using the SQL script provided.');
        } else {
          console.error('Error checking table:', tableError.message);
        }
      } else {
        console.log('Table exists! Current record count:', tableData[0].count);
      }
    } catch (tableErr) {
      console.error('Error checking table:', tableErr.message);
    }

  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

// Run the check and force the script to exit after completion
basicCheck().then(() => {
  console.log('Script completed');
  process.exit(0);
});
