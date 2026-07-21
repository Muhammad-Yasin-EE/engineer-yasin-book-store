const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listQuizzes() {
  const { data, error } = await supabase
    .from('quizzes')
    .select('id, title, category, description')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error querying quizzes:", error);
  } else {
    console.log("Current Quizzes in Database:");
    console.log(JSON.stringify(data, null, 2));
  }
}

listQuizzes();
