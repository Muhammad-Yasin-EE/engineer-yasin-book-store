require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testFetch() {
  const { data, error } = await supabase
    .from('user_scores')
    .select('*, profiles(name, avatar_url), quizzes!fk_user_scores_quizzes(title)')
    .order('percentage', { ascending: false })
    .order('time_taken_seconds', { ascending: true })
    .limit(50);

  if (error) {
    console.error('Fetch Error:', error);
  } else {
    console.log('Fetch Success:', data.length);
  }
}

testFetch();
