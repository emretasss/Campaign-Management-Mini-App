require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Test Supabase connection using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Environment check:');
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\nTesting Supabase connection...');
    
    // Test auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Auth test:', authError ? 'Error' : 'Success');
    if (authError) console.log('Auth error:', authError.message);
    
    // Test database query
    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .limit(1);
    
    console.log('Database test:', error ? 'Error' : 'Success');
    if (error) {
      console.log('Database error:', error.message);
      console.log('Error details:', error);
    } else {
      console.log('Data:', data);
    }
    
  } catch (err) {
    console.error('Connection test failed:', err);
  }
}

testConnection();
