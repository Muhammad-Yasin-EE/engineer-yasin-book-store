const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function cleanOldQuizzes() {
  console.log("Fetching all quizzes...");
  const { data: quizzes, error } = await supabase.from('quizzes').select('id, title');
  
  if (error) {
    console.error(error);
    return;
  }

  for (const quiz of quizzes) {
    const isVerbal = quiz.title.toLowerCase().includes('verbal') || quiz.title.toLowerCase().includes('intelligence');
    
    if (isVerbal) {
      const { data: questions } = await supabase.from('quiz_questions').select('id').eq('quiz_id', quiz.id);
      const count = questions ? questions.length : 0;
      
      if (count < 84) {
        console.log(`Deleting old invalid quiz: "${quiz.title}" (Only had ${count} questions)`);
        await supabase.from('quiz_questions').delete().eq('quiz_id', quiz.id);
        await supabase.from('quizzes').delete().eq('id', quiz.id);
      } else {
        console.log(`Keeping valid quiz: "${quiz.title}" (${count} questions)`);
      }
    }
  }

  console.log("Cleanup complete!");
}

cleanOldQuizzes().catch(console.error);
