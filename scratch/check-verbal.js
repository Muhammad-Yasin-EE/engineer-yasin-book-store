const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkQuestions() {
  const title = "PMA Initial Verbal Intelligence Test 1";
  console.log(`Looking up quiz: ${title}`);
  const { data: quizData } = await supabase.from('quizzes').select('id, title').eq('title', title).single();
  
  if (!quizData) {
    console.log("Quiz not found!");
    return;
  }
  
  const { data: questions } = await supabase.from('quiz_questions').select('id').eq('quiz_id', quizData.id);
  console.log(`Found ${questions ? questions.length : 0} questions in database for this quiz.`);
}

checkQuestions().catch(console.error);
